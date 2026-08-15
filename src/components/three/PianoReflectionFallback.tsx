import { buildKeyLayout } from "@/lib/keyLayout";

/**
 * Static CSS/SVG stand-in for the WebGL hero: same key layout, same
 * "real row (faint) / reflection row (vivid, mirrored)" idea, no canvas.
 * Used on low-power devices, when `prefers-reduced-motion` is set, or while
 * the Three.js chunk is still loading.
 */
export function PianoReflectionFallback() {
  const layout = buildKeyLayout(4);
  const span = layout[layout.length - 1].x || 1;

  return (
    <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
      <div className="relative w-full max-w-3xl px-10" style={{ perspective: 900 }}>
        <div className="relative h-28" style={{ transform: "rotateX(12deg)" }}>
          {layout.map((k, i) => (
            <div
              key={`real-${i}`}
              className="absolute bottom-0 rounded-t-sm"
              style={{
                left: `${(k.x / span) * 100}%`,
                width: k.kind === "black" ? "5%" : "8.5%",
                height: k.kind === "black" ? "62%" : "100%",
                background: k.kind === "accent" ? "#e21f26" : k.kind === "black" ? "#0b0a0d" : "#f4efe6",
                opacity: 0.25,
                zIndex: k.kind === "black" ? 2 : 1,
              }}
            />
          ))}
        </div>

        <div
          className="relative mt-1 h-28 animate-floatSlow"
          style={{
            transform: "rotateX(-12deg) scaleY(-1)",
            maskImage: "linear-gradient(to bottom, black, transparent 85%)",
            WebkitMaskImage: "linear-gradient(to bottom, black, transparent 85%)",
          }}
        >
          {layout.map((k, i) => (
            <div
              key={`refl-${i}`}
              className="absolute bottom-0 rounded-t-sm shadow-red-glow"
              style={{
                left: `${(k.x / span) * 100}%`,
                width: k.kind === "black" ? "5%" : "8.5%",
                height: k.kind === "black" ? "62%" : "100%",
                background: k.kind === "accent" ? "#e21f26" : k.kind === "black" ? "#0b0a0d" : "#f4efe6",
                zIndex: k.kind === "black" ? 2 : 1,
              }}
            />
          ))}
        </div>

        <div className="absolute inset-x-0 top-28 h-px bg-gradient-to-r from-transparent via-ivoire/30 to-transparent" />
      </div>
    </div>
  );
}
