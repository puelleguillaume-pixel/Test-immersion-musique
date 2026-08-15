/**
 * Generates a gradient "cover" as an inline SVG data URI — used wherever we
 * don't have licensed cover art to display (see README: real Genius artwork
 * isn't ours to redistribute without the rights holder's OK). Reuses each
 * collab's own accent colors so the corridor still reads as *that* track's
 * identity rather than a generic filler tile.
 */
function escapeXml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function coverPlaceholder(colorA: string, colorB: string, label: string): string {
  const safeLabel = escapeXml(label);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="480">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${colorA}"/>
        <stop offset="1" stop-color="${colorB}"/>
      </linearGradient>
    </defs>
    <rect width="480" height="480" fill="url(#g)"/>
    <g opacity="0.85">
      <rect x="34" y="30" width="10" height="46" fill="#f4efe6"/>
      <rect x="48" y="30" width="10" height="46" fill="#08070a"/>
      <rect x="62" y="30" width="10" height="46" fill="#f4efe6"/>
      <rect x="76" y="30" width="10" height="46" fill="#e21f26"/>
      <rect x="90" y="30" width="10" height="46" fill="#08070a"/>
    </g>
    <text x="34" y="430" font-family="ui-sans-serif,sans-serif" font-size="30" font-weight="700" fill="#f4efe6">${safeLabel}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
