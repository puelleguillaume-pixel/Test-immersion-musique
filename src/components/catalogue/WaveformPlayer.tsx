import { useEffect, useMemo, useRef, useState } from "react";
import { useAudioStore } from "@/state/audioStore";
import { cn } from "@/lib/cn";

interface WaveformPlayerProps {
  id: string;
  audioUrl?: string;
  seed: number;
  className?: string;
  barCount?: number;
}

/** Deterministic pseudo-random bars from a numeric seed — same pack always
 * renders the same "shape", no audio decode required for the idle preview. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateBars(seed: number, count: number): number[] {
  const rand = mulberry32(seed);
  const bars: number[] = [];
  let last = 0.4;
  for (let i = 0; i < count; i++) {
    const wobble = (rand() - 0.5) * 0.55;
    last = Math.min(1, Math.max(0.12, last * 0.6 + (0.5 + wobble) * 0.4));
    bars.push(last);
  }
  return bars;
}

export function WaveformPlayer({ id, audioUrl, seed, className, barCount = 44 }: WaveformPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const activePlayerId = useAudioStore((s) => s.activePlayerId);
  const setActivePlayer = useAudioStore((s) => s.setActivePlayer);

  const bars = useMemo(() => generateBars(seed, barCount), [seed, barCount]);

  useEffect(() => {
    if (activePlayerId !== id && audioRef.current) {
      audioRef.current.pause();
      setPlaying(false);
    }
  }, [activePlayerId, id]);

  const toggle = () => {
    if (!audioUrl) return;
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      setActivePlayer(id);
      void audio.play();
      setPlaying(true);
    }
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <button
        type="button"
        onClick={toggle}
        disabled={!audioUrl}
        aria-label={playing ? "Mettre en pause" : "Écouter l'aperçu"}
        title={audioUrl ? undefined : "Aperçu audio à venir"}
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors",
          audioUrl
            ? "border-ivoire/30 text-ivoire hover:border-cuir-bright hover:text-cuir-bright"
            : "border-ivoire/10 text-ivoire/25",
        )}
      >
        {playing ? (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <rect x="1" width="4" height="12" />
            <rect x="7" width="4" height="12" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path d="M1 0.5 11 6 1 11.5Z" />
          </svg>
        )}
      </button>

      <div className="flex h-9 flex-1 items-end gap-[2px] overflow-hidden">
        {bars.map((h, i) => {
          const barProgress = i / bars.length;
          const isPast = playing && barProgress <= progress;
          return (
            <span
              key={i}
              className={cn(
                "w-full flex-1 rounded-full transition-colors duration-150",
                isPast ? "bg-cuir-bright" : "bg-ivoire/25",
              )}
              style={{ height: `${h * 100}%` }}
            />
          );
        })}
      </div>

      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          preload="none"
          onTimeUpdate={(e) => {
            const a = e.currentTarget;
            if (a.duration) setProgress(a.currentTime / a.duration);
          }}
          onEnded={() => {
            setPlaying(false);
            setProgress(0);
          }}
        />
      )}
    </div>
  );
}
