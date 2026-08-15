export type KeyKind = "white" | "black" | "accent";

export interface KeyDef {
  kind: KeyKind;
  x: number; // horizontal offset, arbitrary units
}

/**
 * One octave and a half of a keyboard, expressed as an offset layout shared
 * by the 3D hero scene and the CSS/SVG fallback so both read as the same
 * instrument. A single key is tinted `accent` (the red one) to tie back to
 * the leather-jacket red running through the whole site.
 */
export function buildKeyLayout(accentIndex = 4): KeyDef[] {
  const whiteSpacing = 1;
  const pattern: KeyKind[] = [
    "white",
    "black",
    "white",
    "black",
    "white",
    "white",
    "black",
    "white",
    "black",
    "white",
    "black",
    "white",
    "white",
  ];

  let whiteCount = 0;
  const keys: KeyDef[] = pattern.map((kind) => {
    if (kind === "white") {
      const x = whiteCount * whiteSpacing;
      whiteCount += 1;
      return { kind, x };
    }
    // black keys sit in the gap just before the next white key
    return { kind, x: whiteCount * whiteSpacing - whiteSpacing * 0.32 };
  });

  return keys.map((k, i) => (i === accentIndex ? { ...k, kind: "accent" } : k));
}
