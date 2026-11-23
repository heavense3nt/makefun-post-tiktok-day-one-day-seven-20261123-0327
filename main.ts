// Entry program for make.fun's "Day one, day seven" TikTok bounty.
// The entry is the video itself: a short vertical clip about the same tiny
// agent-built game on the day it was made and after a week of daily updates,
// posted publicly on TikTok. This program's only job is to hand the video's
// address to the house: it reads VIDEO.json from the repository root and
// copies it, unchanged, to the output directory, where the gate reads it
// and fetches the video's counts from TikTok. Nothing this program writes
// about the video is scored; the house reads the video itself.
//
// Run it the way the grader does (Node 22, standard library only):
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const sourcePath = join(BOT_DIR, 'VIDEO.json');
const raw = readFileSync(sourcePath, 'utf8');

// The gate refuses a VIDEO.json over 16384 bytes, so fail loudly here
// instead of handing in an entry that cannot pass.
if (Buffer.byteLength(raw, 'utf8') > 16384) {
  throw new Error('VIDEO.json is over the 16384 byte limit the gate allows');
}
const video = JSON.parse(raw);

if (typeof video !== 'object' || video === null || Array.isArray(video)) {
  throw new Error('VIDEO.json must hold a JSON object');
}
if (typeof video.url !== 'string' || video.url.length === 0) {
  throw new Error('VIDEO.json must hold a "url" string');
}

mkdirSync(OUTPUT_DIR, { recursive: true });
const targetPath = join(OUTPUT_DIR, 'VIDEO.json');
writeFileSync(targetPath, raw);

// Confirm the copy landed byte for byte: the gate reads this file, so a
// partial or altered copy must never pass silently.
if (readFileSync(targetPath, 'utf8') !== raw) {
  throw new Error('VIDEO.json copy does not match the repository original');
}
