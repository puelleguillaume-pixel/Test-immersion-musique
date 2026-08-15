import { useState } from "react";
import { motion } from "framer-motion";
import type { Pack } from "@/types";
import { WaveformPlayer } from "./WaveformPlayer";
import { LicenseModal } from "./LicenseModal";
import { beats, grooveEase } from "@/lib/tempo";

const TYPE_LABEL: Record<Pack["type"], string> = {
  loop: "Loop",
  prod: "Prod",
  topline: "Topline",
};

export function PackCard({ pack, index }: { pack: Pack; index: number }) {
  const [licenseOpen, setLicenseOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-8% 0px" }}
        transition={{ duration: beats(0.9), ease: grooveEase, delay: beats((index % 4) * 0.12) }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group relative overflow-hidden rounded-2xl border border-ivoire/10 bg-noir-soft"
      >
        <div
          className="relative flex h-40 items-end overflow-hidden p-4"
          style={{
            background: `linear-gradient(150deg, ${pack.coverGradient[0]}, ${pack.coverGradient[1]})`,
          }}
        >
          <div className="absolute inset-0 opacity-40 mix-blend-overlay bg-grain" />
          <motion.div
            aria-hidden
            className="absolute -right-4 -top-6 flex h-24 w-24 gap-[3px] opacity-70"
            animate={{ rotate: hovered ? -8 : 0, scale: hovered ? 1.08 : 1 }}
            transition={{ duration: beats(0.5), ease: grooveEase }}
          >
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <span
                key={i}
                className="h-full w-2 rounded-sm"
                style={{ background: i === 2 ? "#e21f26" : i % 2 === 0 ? "#f4efe6" : "#0b0a0d" }}
              />
            ))}
          </motion.div>

          <span className="relative rounded-full border border-ivoire/30 bg-noir/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ivoire backdrop-blur">
            {TYPE_LABEL[pack.type]}
          </span>
        </div>

        <div className="p-5">
          <div className="mb-3 flex items-start justify-between gap-2">
            <h3 className="font-display text-lg font-semibold text-ivoire">{pack.title}</h3>
            <span className="whitespace-nowrap font-mono text-xs text-brume-pale">
              {pack.bpm} BPM · {pack.key}
            </span>
          </div>

          <WaveformPlayer id={pack.id} audioUrl={pack.audioUrl} seed={pack.waveformSeed} className="mb-4" />

          <div className="mb-4 flex flex-wrap gap-1.5">
            {pack.mood.map((m) => (
              <span
                key={m}
                className="rounded-full border border-ivoire/15 px-2.5 py-1 text-[11px] capitalize text-brume-pale/80"
              >
                {m}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setLicenseOpen(true)}
            className="w-full rounded-full border border-ivoire/25 py-2.5 font-display text-sm uppercase tracking-wide text-ivoire transition-colors hover:border-cuir-bright hover:bg-cuir-bright/10 hover:text-cuir-bright"
          >
            Licences — dès {pack.licenses[0].price}€
          </button>
        </div>
      </motion.article>

      <LicenseModal pack={pack} open={licenseOpen} onClose={() => setLicenseOpen(false)} />
    </>
  );
}
