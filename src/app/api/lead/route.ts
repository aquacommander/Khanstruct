/* ════════════════════════════════════════════════════════════════════════
   POST /api/lead — pushes a qualified funnel lead into Zain's Notion CRM.

   NOTE ON EMAIL: the lead EMAIL is sent client-side (from the funnel, via
   Web3Forms) because Web3Forms' free tier rejects server-side submissions.
   This route therefore handles ONLY the Notion write — it's a fire-and-forget
   secondary delivery, dormant until NOTION_TOKEN + NOTION_DB_ID are set.

   ── Notion column mapping ───────────────────────────────────────────────────
   Edit notionProperties() to match the CRM ("Leads") database columns:
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

const NOTION_TOKEN = process.env.NOTION_TOKEN ?? '';
const NOTION_DB_ID = process.env.NOTION_DB_ID ?? '';
const NOTION_VERSION = '2022-06-28';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface LeadPayload {
  answers: FunnelAnswers;
  details: LeadDetails;
}

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

  if (NOTION_TOKEN && NOTION_DB_ID) {
    try {
      await writeToNotion(answers, details, priorityLabel);
    } catch (err) {
      // Never lose the lead: surface it in server logs for manual recovery.
      console.error('[lead] Notion write failed — lead preserved in logs:\n', err);
      console.error('[lead] summary:\n', buildLeadSummary(answers, details));
    }
  } else {
    console.warn('[lead] NOTION not configured — skipping CRM write (email handled client-side).');
  }

  return NextResponse.json({ success: true, priority });
}
