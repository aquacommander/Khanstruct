/* ════════════════════════════════════════════════════════════════════════
   POST /api/lead — receives a qualified lead from the funnel, scores it, and
   writes a ranked row into Zain's Notion CRM.

   Runs server-side only, so NOTION_TOKEN never reaches the browser. Until the
   token + database id are configured (Zain is still finalizing his CRM
   columns), the route logs the full lead to the server console as a safety net
   and still returns success — so the visitor experience works today and no
   lead is silently lost.

   ── Adjusting the column mapping ────────────────────────────────────────────
   The notionProperties() map below assumes these CRM column names/types. When
   Zain sends his final columns, edit ONLY that function:
     Name (title) · Email (email) · Company (rich_text) · Service (select)
     Scope (rich_text) · Timeline (select) · Budget (select)
     Priority (select) · Notes (rich_text)
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

/** Build the Notion page properties from the lead. Edit here when the CRM
    columns are finalized. Unknown select options are auto-created by Notion. */
function notionProperties(answers: FunnelAnswers, details: LeadDetails, priorityLabel: string) {
  const text = (s: string) => ({ rich_text: [{ text: { content: s.slice(0, 1900) } }] });
  const select = (s: string) => ({ select: { name: s.slice(0, 100) } });

  const service = typeof answers.service === 'string' ? labelFor(answers.service) : '';
  const scope = Array.isArray(answers.scope) ? answers.scope.map(labelFor).join(', ') : '';
  const timeline = typeof answers.timeline === 'string' ? labelFor(answers.timeline) : '';
  const budget = typeof answers.budget === 'string' ? labelFor(answers.budget) : '';

  return {
    Name: { title: [{ text: { content: details.name.slice(0, 200) || 'New lead' } }] },
    Email: { email: details.email },
    Company: text(details.company || ''),
    Service: select(service || 'Unspecified'),
    Scope: text(scope || '—'),
    Timeline: select(timeline || 'Unspecified'),
    Budget: select(budget || 'Unspecified'),
    Priority: select(priorityLabel),
    Notes: text(details.message || '—'),
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

  // Configured → deliver to Notion. Not configured (or failure) → log fallback.
  if (NOTION_TOKEN && NOTION_DB_ID) {
    try {
      await writeToNotion(answers, details, priorityLabel);
    } catch (err) {
      // Never lose the lead: surface it in server logs for manual recovery.
      console.error('[lead] Notion write failed — lead preserved in logs:\n', err);
      console.error('[lead] summary:\n', buildLeadSummary(answers, details));
    }
  } else {
    console.warn(
      '[lead] NOTION_TOKEN/NOTION_DB_ID not set — logging lead instead:\n',
      buildLeadSummary(answers, details),
    );
  }

  return NextResponse.json({ success: true, priority });
}
