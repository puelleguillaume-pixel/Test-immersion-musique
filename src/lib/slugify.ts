const ACCENTS: Record<string, string> = {
  a: "áàâäãå",
  e: "éèêë",
  i: "íìîï",
  o: "óòôöõ",
  u: "úùûü",
  c: "ç",
  n: "ñ",
  y: "ýÿ",
};

const ACCENT_TO_PLAIN = new Map<string, string>();
for (const [plain, accented] of Object.entries(ACCENTS)) {
  for (const ch of accented) {
    ACCENT_TO_PLAIN.set(ch, plain);
    ACCENT_TO_PLAIN.set(ch.toUpperCase(), plain);
  }
}

function stripAccents(input: string): string {
  return Array.from(input)
    .map((ch) => ACCENT_TO_PLAIN.get(ch) ?? ch)
    .join("");
}

export function slugify(input: string): string {
  return stripAccents(input)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

/** Appends a short random suffix so two packs with the same title don't collide. */
export function uniqueSlug(input: string): string {
  const base = slugify(input) || "pack";
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base}-${suffix}`;
}
