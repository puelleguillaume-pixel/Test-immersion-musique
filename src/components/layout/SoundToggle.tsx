import { useEffect } from "react";
import { motion } from "framer-motion";
import { useAudioStore } from "@/state/audioStore";
import { resumeAudio } from "@/lib/audioEngine";

/**
 * Permanently visible mute toggle for the ambient drone — audio never
 * autoplays; this is the only thing that can start it, per the brief.
 */
export function SoundToggle() {
  const { ambientEnabled, toggleAmbient } = useAudioStore();

  useEffect(() => {
    if (ambientEnabled) {
      resumeAudio();
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const gain = ctx.createGain();
      gain.gain.value = 0;
      gain.connect(ctx.destination);

      const freqs = [55, 110.5, 164.8];
      const oscs = freqs.map((f, i) => {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = f;
        const voiceGain = ctx.createGain();
        voiceGain.gain.value = i === 0 ? 0.6 : 0.22;
        osc.connect(voiceGain);
        voiceGain.connect(gain);
        osc.start();
        return osc;
      });

      gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 1.2);

      return () => {
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
        setTimeout(() => {
          oscs.forEach((o) => o.stop());
          void ctx.close();
        }, 500);
      };
    }
  }, [ambientEnabled]);

  return (
    <motion.button
      type="button"
      onClick={toggleAmbient}
      whileTap={{ scale: 0.92 }}
      aria-pressed={ambientEnabled}
      aria-label={ambientEnabled ? "Couper le son ambiant" : "Activer le son ambiant"}
      className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-ivoire/20 bg-noir-soft/80 backdrop-blur transition-colors hover:border-cuir-bright"
    >
      <div className="flex h-4 items-end gap-[3px]">
        {[0.4, 1, 0.6, 0.85].map((h, i) => (
          <motion.span
            key={i}
            className="w-[3px] rounded-full bg-ivoire"
            style={{ height: `${h * 16}px` }}
            animate={
              ambientEnabled
                ? { scaleY: [0.4, 1, 0.5, 0.9], opacity: 1 }
                : { scaleY: 0.3, opacity: 0.35 }
            }
            transition={
              ambientEnabled
                ? { duration: 1.1, repeat: Infinity, delay: i * 0.12, ease: "easeInOut" }
                : { duration: 0.3 }
            }
          />
        ))}
      </div>
    </motion.button>
  );
}
