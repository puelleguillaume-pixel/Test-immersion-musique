import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Collab } from "@/types";
import { CollabTile } from "./CollabTile";
import { WaveformPlayer } from "@/components/catalogue/WaveformPlayer";
import { beats, grooveEase } from "@/lib/tempo";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export function CollabWall({ collabs }: { collabs: Collab[] }) {
  const [hovered, setHovered] = useState<Collab | null>(null);
  const [selected, setSelected] = useState<Collab | null>(null);
  const reduced = usePrefersReducedMotion();

  const ambient = hovered ?? collabs[0];

  return (
    <div className="relative">
      {!reduced && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -inset-x-10 -inset-y-16 -z-10 rounded-[3rem] opacity-40 blur-3xl"
          animate={{
            background: `radial-gradient(circle at 30% 30%, ${ambient.accent[0]}55, transparent 60%), radial-gradient(circle at 70% 70%, ${ambient.accent[1]}55, transparent 60%)`,
          }}
          transition={{ duration: beats(1), ease: grooveEase }}
        />
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {collabs.map((c, i) => (
          <CollabTile key={c.id} collab={c} index={i} onHover={setHovered} onSelect={setSelected} />
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-noir/80 p-6 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: beats(0.6), ease: grooveEase }}
              className="w-full max-w-md overflow-hidden rounded-2xl border border-ivoire/10 bg-noir-soft"
            >
              <div
                className="h-28 w-full"
                style={{ background: `linear-gradient(140deg, ${selected.accent[0]}, ${selected.accent[1]})` }}
              />
              <div className="p-6">
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-cuir-bright">
                  {selected.year} · {selected.role}
                </p>
                <h3 className="mt-1 font-display text-2xl font-semibold text-ivoire">{selected.artist}</h3>
                <p className="text-brume-pale">{selected.track}</p>
                <WaveformPlayer
                  id={`collab-${selected.id}`}
                  audioUrl={selected.audioUrl}
                  seed={selected.artist.length * 17 + selected.year}
                  className="mt-6"
                />
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="mt-6 w-full rounded-full border border-ivoire/20 py-2.5 text-sm uppercase tracking-wide text-ivoire hover:border-cuir-bright"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
