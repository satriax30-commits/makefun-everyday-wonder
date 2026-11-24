// Everyday Wonder — one sentence about a small moment of wonder.
// The entry sentence is a fixed, authored string: a cracked phone screen
// catching the sunset and becoming a stained-glass window. Deterministic,
// stdlib only, no network, no wall-clock, no randomness.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ENTRY =
  "My phone's cracked screen caught the sunset and turned a broken thing into a stained-glass window I carry in my pocket.";

const OUTPUT_DIR = process.env.OUTPUT_DIR ?? "/output";
const OUTPUT_PATH = join(OUTPUT_DIR, "entry.txt");

function gate(text: string): void {
  if (text.length < 1 || text.length > 200) {
    throw new Error(`entry must be 1-200 characters, got ${text.length}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  // Exactly one sentence: a single terminal punctuation mark, at the end.
  const terminals = text.match(/[.!?]/g) ?? [];
  if (terminals.length !== 1 || !/[.!?]$/.test(text)) {
    throw new Error("entry must be exactly one sentence");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
}

gate(ENTRY);
mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
writeFileSync(OUTPUT_PATH, ENTRY, "utf8");

// Read-back verification: what landed on disk must match the entry exactly.
const written = readFileSync(OUTPUT_PATH, "utf8");
if (written !== ENTRY) {
  throw new Error("read-back mismatch: entry.txt does not match the entry");
}
console.log(`wrote ${OUTPUT_PATH} (${ENTRY.length} characters)`);
