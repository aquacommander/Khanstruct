/* ════════════════════════════════════════════════════════════════════════
   POST /api/lead — receives a qualified lead from the funnel, scores it, and
   delivers it.

   Runs server-side only, so no key reaches the browser.

   Delivery order:
     1. EMAIL (primary) — every submission is emailed to zain@thekhanstruct.com
        via Web3Forms, with the priority in the subject so it's triageable at a
        glance. Needs WEB3FORMS_KEY (or NEXT_PUBLIC_WEB3FORMS_KEY).
     2. NOTION (optional, later) — also writes a ranked CRM row when a token is
        configured. Off by default until Zain provides it.
     3. LOG FALLBACK — if neither is configured/succeeds, the full lead is
        written to the server log so it's never lost.

   The visitor always sees success; failures are logged, never surfaced.

   ── Notion column mapping ───────────────────────────────────────────────────
   Edit notionProperties() when Zain finalizes his CRM columns:
     Name (title) · Email (email) · Company (rich_text) · Phone (rich_text)
     Service (select) · Scope (rich_text) · Timeline (select) · Budget (select)
     Priority (select)
   ──────────────────────────────────────────────────────────────────────── */

import { NextResponse } from 'next/server';
import {
  scoreLead,
  buildLeadSummary,
  labelFor,
  PRIORITY_META,
  type FunnelAnswers,
  type LeadDetails,
} from '@/lib/funnel';

// Web3Forms key (server-side; falls back to the public key the contact form uses).
const WEB3FORMS_KEY = process.env.WEB3FORMS_KEY ?? process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? '';

const NOTION_TOKEN = process.env.NOTION_TOKEN ?? '';
const NOTION_DB_ID = process.env.NOTION_DB_ID ?? '';
const NOTION_VERSION = '2022-06-28';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface LeadPayload {
  answers: FunnelAnswers;
  details: LeadDetails;
}

// ── Email delivery (Web3Forms) ──────────────────────────────────────────────

async function sendLeadEmail(
  answers: FunnelAnswers,
  details: LeadDetails,
  priorityLabel: string,
  summary: string,
) {
  const service = typeof answers.service === 'string' ? labelFor(answers.service) : '';
  const res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: WEB3FORMS_KEY,
      subject: `New project lead — ${priorityLabel}${service ? ` · ${service}` : ''}`,
      from_name: 'The Construct — Project Funnel',
      // Surfacing the prospect's email/name lets Zain reply straight to them.
      name: details.name,
      email: details.email,
      replyto: details.email,
      message: summary,
    }),
  });
  const json = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string };
  if (!res.ok || !json.success) {
    throw new Error(`Web3Forms ${res.status}: ${json.message || 'send failed'}`);
  }
}

// ── Notion delivery (optional) ──────────────────────────────────────────────

/** Build the Notion page properties. Unknown select options are auto-created. */
function notionProperties(answers: FunnelAnswers, details: LeadDetails, priorityLabel: string) {
  const text = (s: string) => ({ rich_text: [{ text: { content: s.slice(0, 1900) } }] });
  const select = (s: string) => ({ select: { name: s.slice(0, 100) } });

  const service = typeof answers.service === 'string' ? labelFor(answers.service) : '';
  const scope = Array.isArray(answers.scope) ? answers.scope.map(labelFor).join(', ') : '';
  const timeline = typeof answers.timeline === 'string' ? labelFor(answers.timeline) : '';
  const budget = typeof answers.budget === 'string' ? labelFor(answers.budget) : '';

  return {
    Company: text(details.company || ''),
    Name: { title: [{ text: { content: details.name.slice(0, 200) || 'New lead' } }] },
    Email: { email: details.email },
    Phone: text(details.phone || ''),
    Service: select(service || 'Unspecified'),
    Scope: text(scope || '—'),
    Timeline: select(timeline || 'Unspecified'),
    Budget: select(budget || 'Unspecified'),
    Priority: select(priorityLabel),
  };
}

async function writeToNotion(answers: FunnelAnswers, details: LeadDetails, priorityLabel: string) {
  const res = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${NOTION_TOKEN}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      parent: { database_id: NOTION_DB_ID },
      properties: notionProperties(answers, details, priorityLabel),
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Notion ${res.status}: ${body}`);
  }
}

// ── Handler ─────────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  let payload: LeadPayload;
  try {
    payload = (await request.json()) as LeadPayload;
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid request.' }, { status: 400 });
  }

  const { answers, details } = payload ?? {};
  if (
    !answers ||
    !details ||
    !details.name?.trim() ||
    !EMAIL_RE.test(details.email?.trim() ?? '')
  ) {
    return NextResponse.json(
      { success: false, message: 'Name and a valid email are required.' },
      { status: 400 },
    );
  }

  const { priority } = scoreLead(answers);
  const priorityLabel = PRIORITY_META[priority].label;
  const summary = buildLeadSummary(answers, details);

  let delivered = false;

  // 1) Email — primary. Every lead lands in Zain's inbox.
  if (WEB3FORMS_KEY) {
    try {
      await sendLeadEmail(answers, details, priorityLabel, summary);
      delivered = true;
    } catch (err) {
      console.error('[lead] email send failed:', err);
    }
  } else {
    console.warn('[lead] WEB3FORMS_KEY not set — email skipped (add the key to enable).');
  }

  // 2) Notion — optional secondary, on once a token is configured.
  if (NOTION_TOKEN && NOTION_DB_ID) {
    try {
      await writeToNotion(answers, details, priorityLabel);
      delivered = true;
    } catch (err) {
      console.error('[lead] Notion write failed:', err);
    }
  }

  // 3) Safety net — never lose a lead.
  if (!delivered) {
    console.warn('[lead] not delivered (email/notion off or failed) — preserving lead:\n', summary);
  }

  return NextResponse.json({ success: true, priority });
}
