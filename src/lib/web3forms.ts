/* ════════════════════════════════════════════════════════════════════════
   WEB3FORMS DELIVERY

   Web3Forms sends each submission to the inbox tied to the access key. To
   deliver every form to BOTH inboxes (Zain's + Suyama's), we list two keys
   and POST the submission to each — one email per key.

   Keys are public by design (client-side, free tier) and spam-guarded by the
   honeypot + Web3Forms' own server checks. Set them in .env.local (and your
   host's env vars):
     NEXT_PUBLIC_WEB3FORMS_KEY    — Zain's key   → zain@thekhanstruct.com
     NEXT_PUBLIC_WEB3FORMS_KEY_2  — Suyama's key → his own inbox
   ──────────────────────────────────────────────────────────────────────── */

export const WEB3FORMS_KEYS: string[] = [
  process.env.NEXT_PUBLIC_WEB3FORMS_KEY,
  process.env.NEXT_PUBLIC_WEB3FORMS_KEY_2,
].filter((k): k is string => Boolean(k));

/**
 * Submit a payload to every configured Web3Forms key (one email per inbox).
 * Succeeds if at least one delivery is accepted, so a single failing key never
 * blocks the visitor.
 */
export async function submitToWeb3Forms(
  payload: Record<string, unknown>,
): Promise<{ success: boolean; message?: string }> {
  if (WEB3FORMS_KEYS.length === 0) {
    return { success: false, message: 'No Web3Forms key configured.' };
  }

  const results = await Promise.allSettled(
    WEB3FORMS_KEYS.map((access_key) =>
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ access_key, ...payload }),
      }).then(async (res) => {
        const json = (await res.json().catch(() => ({}))) as {
          success?: boolean;
          message?: string;
        };
        return { ok: res.ok && Boolean(json.success), message: json.message };
      }),
    ),
  );

  const anyOk = results.some((r) => r.status === 'fulfilled' && r.value.ok);

  let firstMessage: string | undefined;
  for (const r of results) {
    if (r.status === 'fulfilled' && r.value.message) {
      firstMessage = r.value.message;
      break;
    }
  }

  return { success: anyOk, message: anyOk ? undefined : firstMessage };
}
