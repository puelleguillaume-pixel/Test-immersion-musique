import { motion } from "framer-motion";
import type { Collab } from "@/types";
import { beats, grooveEase } from "@/lib/tempo";

interface CollabTileProps {
  collab: Collab;
  index: number;
  onHover: (collab: Collab | null) => void;
  onSelect: (collab: Collab) => void;
}

export function CollabTile({ collab, index, onHover, onSelect }: CollabTileProps) {
  return (
    <motion.button
      type="button"
      onMouseEnter={() => onHover(collab)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(collab)}
      onBlur={() => onHover(null)}
      onClick={() => onSelect(collab)}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: beats(0.8), ease: grooveEase, delay: beats((index % 6) * 0.1) }}
      whileHover={{ y: -6 }}
      className="group relative aspect-square overflow-hidden rounded-xl border border-ivoire/10 text-left"
      style={{
        background: `linear-gradient(155deg, ${collab.accent[0]}22, ${collab.accent[1]})`,
      }}
    >
      <div className="absolute inset-0 opacity-30 mix-blend-overlay bg-grain" />
      <div className="absolute inset-0 flex flex-col justify-end p-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ivoire/50">
          {[collab.year, collab.role].filter(Boolean).join(" · ")}
        </p>
        <p className="mt-1 font-display text-base font-semibold text-ivoire">{collab.artist}</p>
        <p className="text-sm text-ivoire/70">{collab.track}</p>
      </div>
      <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-ivoire/20 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" className="text-ivoire">
          <path d="M1 0.5 11 6 1 11.5Z" />
        </svg>
      </div>
    </motion.button>
  );
}
