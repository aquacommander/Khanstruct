#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════════
   CONTENT INGESTION PIPELINE  (skeleton)

   Turns Zain's organized Drive folders into optimized media on Cloudflare R2
   plus a regenerated gallery manifest (src/lib/showreel.ts → MEDIA_ITEMS).

   Designed for the Cloudflare FREE plan: R2 only (10 GB, no egress fees). We do
   our own image/video optimization here instead of paying for Cloudflare
   Stream/Images. The pipeline tracks total bytes and refuses to cross ~9 GB so
   nothing ever triggers a charge — see BUDGET_LIMIT_BYTES below.

   STATUS: skeleton. The heavy steps (sharp / ffmpeg / S3 upload) are marked
   TODO and run only once the deps are installed and R2 keys are provided:
     npm i -D sharp @aws-sdk/client-s3
   Required env (see .env.example):
     R2_ACCOUNT_ID  R2_ACCESS_KEY_ID  R2_SECRET_ACCESS_KEY  R2_BUCKET  R2_PUBLIC_URL

   Run (per batch, in Zain's 01→10 priority order):
     node scripts/ingest.mjs --src "/path/to/The Construct Website Content/01 - High-Priority Projects"
   ──────────────────────────────────────────────────────────────────────── */

import { readdir, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

const BUDGET_LIMIT_BYTES = 9 * 1024 * 1024 * 1024; // 9 GB guardrail under R2's 10 GB free tier

// ── Map Zain's folder names → gallery category ids (lib/showreel MEDIA_CATEGORIES)
const CATEGORY_BY_FOLDER = {
  '02 - AI and Automation': 'ai-video',
  '03 - Data and Analytics': 'data',
  '04 - Software Development': 'web',
  '05 - Website and Design': 'design',
  '06 - Content Creation': 'ai-video',
  '07 - Videos and Animations': 'ai-video',
  '08 - Logos and Brand Assets': 'brand',
  '09 - Social Media Content': 'social',
};

function parseArgs(argv) {
  const out = {};
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--src') out.src = argv[++i];
    if (argv[i] === '--dry') out.dry = true;
  }
  return out;
}

/** Read a project's "Project Information" doc into structured fields.
    Expects the fixed template (Title / Category / Description / Technologies /
    Preferred thumbnail / Placement / Public / Client / Date). */
async function readProjectInfo(projectDir) {
  // TODO: locate the "Project Information" file (txt/md/docx export) and parse
  // its key:value lines into an object. Flag + skip projects missing it.
  try {
    const raw = await readFile(join(projectDir, 'Project Information.txt'), 'utf8');
    const fields = {};
    for (const line of raw.split('\n')) {
      const idx = line.indexOf(':');
      if (idx > 0) fields[line.slice(0, idx).trim().toLowerCase()] = line.slice(idx + 1).trim();
    }
    return fields;
  } catch {
    return null; // missing doc → caller reports it
  }
}

/** Optimize one image into thumb/display/full WebP. Returns local output paths. */
async function optimizeImage(/* file */) {
  // TODO (sharp): resize to 3 widths, encode WebP/AVIF, write to a tmp dir.
  // const sharp = (await import('sharp')).default;
  // await sharp(file).resize(480).webp({ quality: 72 }).toFile(thumbPath); ...
  throw new Error('optimizeImage not implemented — install sharp');
}

/** Transcode one video to a small web MP4 + poster + short hover preview clip. */
async function optimizeVideo(/* file */) {
  // TODO (ffmpeg): H.264 MP4 (CRF ~26), poster frame, 2–3s muted preview clip.
  throw new Error('optimizeVideo not implemented — install ffmpeg');
}

/** Upload a local file to R2 under `key`; returns its public URL. */
async function uploadToR2(/* localPath, key */) {
  // TODO (@aws-sdk/client-s3 against the R2 S3 endpoint):
  // const client = new S3Client({ region: 'auto',
  //   endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  //   credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY } });
  // await client.send(new PutObjectCommand({ Bucket: R2_BUCKET, Key: key, Body: ... }));
  // return `${process.env.R2_PUBLIC_URL}/${key}`;
  throw new Error('uploadToR2 not implemented — install @aws-sdk/client-s3 + set R2 env');
}

/** Emit the MEDIA_ITEMS array as a .ts module the site imports. */
async function writeManifest(/* items */) {
  // TODO: serialize items → src/lib/generated/media.ts and have showreel.ts
  // import from it. Keeps generated data separate from hand-written config.
  throw new Error('writeManifest not implemented');
}

async function main() {
  const args = parseArgs(process.argv);
  if (!args.src) {
    console.error('Usage: node scripts/ingest.mjs --src "<batch folder>" [--dry]');
    process.exit(1);
  }

  let totalBytes = 0;
  const items = [];
  const missingInfo = [];

  const projects = await readdir(args.src, { withFileTypes: true });
  for (const entry of projects) {
    if (!entry.isDirectory()) continue;
    const projectDir = join(args.src, entry.name);

    const info = await readProjectInfo(projectDir);
    if (!info) {
      missingInfo.push(entry.name);
      continue;
    }
    if ((info.public || '').toLowerCase().startsWith('n')) continue; // private → skip

    // Walk Images/ and Videos/, optimize, upload, append manifest entries.
    // Budget guard: stop before crossing the free-tier ceiling.
    for (const sub of ['Images', 'Videos']) {
      const dir = join(projectDir, sub);
      let files = [];
      try {
        files = await readdir(dir);
      } catch {
        continue;
      }
      for (const f of files) {
        const size = (await stat(join(dir, f))).size;
        if (totalBytes + size > BUDGET_LIMIT_BYTES) {
          console.warn(
            `\n⚠️  Stopping: next file would cross the ${(BUDGET_LIMIT_BYTES / 1e9).toFixed(
              1,
            )} GB R2 free-tier guardrail. Processed ${(totalBytes / 1e9).toFixed(2)} GB so far.`,
          );
          console.warn('   Compress further, or get Zain to approve a small paid bump.');
          await finish(items, missingInfo);
          return;
        }
        totalBytes += size;
        // if (!args.dry) { optimize → upload → items.push({...}) }
      }
    }
  }

  await finish(items, missingInfo);
}

async function finish(items, missingInfo) {
  if (missingInfo.length) {
    console.warn(`\n${missingInfo.length} project(s) missing Project Information — skipped:`);
    missingInfo.forEach((n) => console.warn(`  • ${n}`));
  }
  console.log(`\nReady to write ${items.length} item(s) to the manifest.`);
  // await writeManifest(items);
  console.log('Skeleton run complete. Implement the TODOs to go live.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
