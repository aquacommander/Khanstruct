# Content Ingestion Pipeline

Turns Zain's organized Google Drive folders into optimized media on **Cloudflare R2**
and a regenerated gallery manifest the website reads.

## Why this exists

The gallery (`/work` + the homepage Showreel) renders from `src/lib/showreel.ts`
(`MEDIA_ITEMS`). Hand-typing 6,000+ entries is impossible — this pipeline generates
them from Zain's folders + the **Project Information** doc in each project.

## Free-plan design (important)

We are on Cloudflare's **free plan**, so:

- **R2 only** — no Cloudflare **Stream** or **Images** (both paid). We optimize
  images (sharp) and video (ffmpeg) ourselves and store everything in R2.
- R2 free tier = **10 GB storage, no egress fees**. The script enforces a **9 GB
  guardrail** (`BUDGET_LIMIT_BYTES`) and stops before anything could incur a charge.

## Setup (once)

1. Zain enables **R2** in Cloudflare and creates a bucket (e.g. `construct-media`)
   with a public `r2.dev` URL, plus an **Object Read & Write** API token.
2. Add to `.env.local` (and Vercel, server-side):
   ```
   R2_ACCOUNT_ID=...
   R2_ACCESS_KEY_ID=...
   R2_SECRET_ACCESS_KEY=...
   R2_BUCKET=construct-media
   R2_PUBLIC_URL=https://<bucket>.r2.dev
   ```
3. Install the processing deps:
   ```
   npm i -D sharp @aws-sdk/client-s3
   ```
   (ffmpeg must be available on the machine running the script.)

## Folder structure expected (matches the message sent to Zain)

```
The Construct Website Content/
  01 - High-Priority Projects/
    <Project Name>/
      Images/  Videos/  Documents/  Original Files/
      Project Information.txt   ← Title, Category, Description, Technologies,
                                   Preferred thumbnail, Placement, Public, Client, Date
  02 - AI and Automation/
  ... 03–10
```

## Run (per batch, in priority order)

```
node scripts/ingest.mjs --src "/path/to/The Construct Website Content/01 - High-Priority Projects"
```

Process Batch 1 first → the site goes live with it → later batches stream in without
blocking. Use `--dry` to validate folders/docs without uploading.

## Status

`ingest.mjs` is a **working skeleton**: folder walking, Project Information parsing,
the budget guardrail, and the category mapping are in place. The three heavy steps —
`optimizeImage` (sharp), `optimizeVideo` (ffmpeg), `uploadToR2` (S3 API), and
`writeManifest` — are marked `TODO` and get implemented once the deps + R2 keys exist.
