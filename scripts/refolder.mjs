#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════════
   REFOLDER — move R2 objects into the {Category} segment the gallery schema
   expects:  2026/{NN_Month}/{YYYY-MM-DD}/{Category}/{Project}/…

   Some projects were imported straight under the date folder with no category
   segment, so gen-manifest.mjs labels them "Uncategorized" and showreel.ts has
   to guess the topic at runtime. Moving them makes the category STORED data
   you can correct by hand, instead of a heuristic.

   This does NOT invent dates. The dates in those paths are ingest dates and the
   real ones aren't recoverable from anything in the bucket or the repo.

   ── Usage ──────────────────────────────────────────────────────────────────
     node scripts/refolder.mjs --plan refolder-plan.json            # dry run
     node scripts/refolder.mjs --plan refolder-plan.json --apply    # copy
     node scripts/refolder.mjs --plan refolder-plan.json --cleanup  # delete old

   Run --apply first, regenerate the manifest, confirm the live site is intact,
   and only then run --cleanup. Deleting first would 404 every moved album.

   Env (.env.local): R2_ACCOUNT_ID R2_ACCESS_KEY_ID R2_SECRET_ACCESS_KEY R2_BUCKET
   ──────────────────────────────────────────────────────────────────────── */

import { readFileSync } from 'node:fs';
import {
  S3Client,
  ListObjectsV2Command,
  CopyObjectCommand,
  DeleteObjectsCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';

// ── args ────────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const arg = (name) => {
  const i = argv.indexOf(name);
  return i >= 0 ? argv[i + 1] : undefined;
};
const APPLY = argv.includes('--apply');
const CLEANUP = argv.includes('--cleanup');
const PLAN_PATH = arg('--plan') ?? 'refolder-plan.json';

if (APPLY && CLEANUP) {
  console.error('Pick one: --apply (copy) or --cleanup (delete originals).');
  process.exit(1);
}

// ── env ─────────────────────────────────────────────────────────────────────
const env = { ...process.env };
try {
  for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
    const i = line.indexOf('=');
    if (i > 0 && !line.trimStart().startsWith('#')) {
      env[line.slice(0, i).trim()] ??= line.slice(i + 1).trim();
    }
  }
} catch {
  /* no .env.local — rely on the real environment */
}

const need = ['R2_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET'];
const missing = need.filter((k) => !env[k]);
if (missing.length) {
  console.error(`Missing env: ${missing.join(', ')}\nSet them in .env.local (see .env.example).`);
  process.exit(1);
}
const BUCKET = env.R2_BUCKET; // required outright — gen-manifest's fallback is a typo

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
});

// ── helpers ─────────────────────────────────────────────────────────────────
/** CopySource must be URL-encoded per segment; these keys hold spaces and (). */
const copySource = (key) =>
  `${BUCKET}/${key.split('/').map(encodeURIComponent).join('/')}`;

async function listPrefix(prefix) {
  const keys = [];
  let token;
  do {
    const res = await s3.send(
      new ListObjectsV2Command({ Bucket: BUCKET, Prefix: prefix, ContinuationToken: token }),
    );
    for (const o of res.Contents ?? []) keys.push(o.Key);
    token = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (token);
  return keys;
}

async function exists(key) {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
    return true;
  } catch {
    return false;
  }
}

// ── plan ────────────────────────────────────────────────────────────────────
const { plan } = JSON.parse(readFileSync(PLAN_PATH, 'utf8'));
if (!Array.isArray(plan) || !plan.length) {
  console.error(`No moves in ${PLAN_PATH}.`);
  process.exit(1);
}

const mode = APPLY ? 'APPLY (copy)' : CLEANUP ? 'CLEANUP (delete originals)' : 'DRY RUN';
console.log(`\n${mode} — ${plan.length} projects, bucket "${BUCKET}"\n`);

let objects = 0;
let copied = 0;
let skipped = 0;
let deleted = 0;

for (const move of plan) {
  const keys = await listPrefix(move.oldPrefix);
  if (!keys.length) {
    console.log(`  ⚠ nothing under ${move.oldPrefix} — already moved?`);
    continue;
  }
  objects += keys.length;
  console.log(`  ${move.topicLabel.padEnd(18)} ${String(keys.length).padStart(3)} obj  ${move.title}`);
  console.log(`      ${move.oldPrefix}\n   -> ${move.newPrefix}`);

  if (APPLY) {
    for (const key of keys) {
      const dest = move.newPrefix + key.slice(move.oldPrefix.length);
      if (await exists(dest)) {
        skipped += 1;
        continue;
      }
      await s3.send(
        new CopyObjectCommand({ Bucket: BUCKET, Key: dest, CopySource: copySource(key) }),
      );
      copied += 1;
    }
  }

  if (CLEANUP) {
    // Only delete an original once its copy is confirmed present.
    const removable = [];
    for (const key of keys) {
      const dest = move.newPrefix + key.slice(move.oldPrefix.length);
      if (await exists(dest)) removable.push({ Key: key });
      else console.log(`      ✗ no copy at ${dest} — keeping original`);
    }
    for (let i = 0; i < removable.length; i += 1000) {
      const batch = removable.slice(i, i + 1000);
      await s3.send(
        new DeleteObjectsCommand({ Bucket: BUCKET, Delete: { Objects: batch, Quiet: true } }),
      );
      deleted += batch.length;
    }
  }
}

console.log(`\n${plan.length} projects · ${objects} objects`);
if (APPLY) console.log(`copied ${copied}, skipped ${skipped} already present`);
if (CLEANUP) console.log(`deleted ${deleted} originals`);
if (!APPLY && !CLEANUP) console.log('Dry run only. Re-run with --apply to copy.');
console.log(
  APPLY
    ? '\nNext: node scripts/gen-manifest.mjs, verify the live site, THEN --cleanup.\n'
    : '',
);
