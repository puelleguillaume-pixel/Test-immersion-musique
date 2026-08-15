import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { noteToFreq, playNote } from "@/lib/audioEngine";
import { cn } from "@/lib/cn";

interface PianoNote {
  note: string;
  octave: number;
  kind: "white" | "black";
  keyBinding: string;
  label: string;
}

// two octaves, mapped to a home-row + top-row QWERTY layout like most DAWs/synths
const NOTES: PianoNote[] = [
  { note: "C", octave: 4, kind: "white", keyBinding: "q", label: "Q" },
  { note: "C#", octave: 4, kind: "black", keyBinding: "2", label: "2" },
  { note: "D", octave: 4, kind: "white", keyBinding: "w", label: "W" },
  { note: "D#", octave: 4, kind: "black", keyBinding: "3", label: "3" },
  { note: "E", octave: 4, kind: "white", keyBinding: "e", label: "E" },
  { note: "F", octave: 4, kind: "white", keyBinding: "r", label: "R" },
  { note: "F#", octave: 4, kind: "black", keyBinding: "5", label: "5" },
  { note: "G", octave: 4, kind: "white", keyBinding: "t", label: "T" },
  { note: "G#", octave: 4, kind: "black", keyBinding: "6", label: "6" },
  { note: "A", octave: 4, kind: "white", keyBinding: "y", label: "Y" },
  { note: "A#", octave: 4, kind: "black", keyBinding: "7", label: "7" },
  { note: "B", octave: 4, kind: "white", keyBinding: "u", label: "U" },
  { note: "C", octave: 5, kind: "white", keyBinding: "i", label: "I" },
  { note: "D", octave: 5, kind: "white", keyBinding: "o", label: "O" },
  { note: "E", octave: 5, kind: "white", keyBinding: "p", label: "P" },
];

const ACCENT_NOTE = "C-4";

export function InteractivePiano() {
  const [pressed, setPressed] = useState<Set<string>>(new Set());
  const heldFromKeyboard = useRef<Set<string>>(new Set());

  const whiteNotes = useMemo(() => NOTES.filter((n) => n.kind === "white"), []);
  const blackNotes = useMemo(() => NOTES.filter((n) => n.kind === "black"), []);
  const whiteWidth = 100 / whiteNotes.length;

  const trigger = useCallback((id: string, note: string, octave: number) => {
    playNote(noteToFreq(note, octave));
    setPressed((prev) => new Set(prev).add(id));
    window.setTimeout(() => {
      setPressed((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 160);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const target = e.target as HTMLElement;
      if (target.closest("input,textarea,[contenteditable='true']")) return;
      const match = NOTES.find((n) => n.keyBinding === e.key.toLowerCase());
      if (!match) return;
      const id = `${match.note}-${match.octave}`;
      heldFromKeyboard.current.add(id);
      trigger(id, match.note, match.octave);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [trigger]);

  return (
    <div className="w-full">
      <div className="relative mx-auto h-40 max-w-3xl select-none rounded-xl bg-key-gradient p-2 shadow-[inset_0_2px_20px_rgba(0,0,0,0.6)] sm:h-48">
        <div className="relative h-full">
          {whiteNotes.map((n, i) => {
            const id = `${n.note}-${n.octave}`;
            const isAccent = id === ACCENT_NOTE;
            const isPressed = pressed.has(id);
            return (
              <motion.button
                key={id}
                type="button"
                aria-label={`Jouer ${n.note}${n.octave}`}
                onPointerDown={() => trigger(id, n.note, n.octave)}
                animate={{
                  y: isPressed ? 6 : 0,
                  backgroundColor: isPressed ? (isAccent ? "#e21f26" : "#d9cfc0") : "#f4efe6",
                }}
                transition={{ duration: 0.08 }}
                className={cn(
                  "absolute bottom-0 top-0 rounded-b-md border border-black/10",
                  isAccent && "ring-2 ring-cuir-bright ring-offset-1 ring-offset-noir",
                )}
                style={{ left: `${i * whiteWidth}%`, width: `${whiteWidth}%` }}
              >
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase text-noir/50">
                  {n.label}
                </span>
              </motion.button>
            );
          })}

          {blackNotes.map((n) => {
            const blackFreq = noteToFreq(n.note, n.octave);
            const whiteIndexBefore = whiteNotes.findIndex(
              (w) => noteToFreq(w.note, w.octave) > blackFreq,
            );
            const idx = whiteIndexBefore === -1 ? whiteNotes.length : whiteIndexBefore;
            const id = `${n.note}-${n.octave}`;
            const isPressed = pressed.has(id);
            return (
              <motion.button
                key={id}
                type="button"
                aria-label={`Jouer ${n.note}${n.octave}`}
                onPointerDown={() => trigger(id, n.note, n.octave)}
                animate={{
                  y: isPressed ? 5 : 0,
                  backgroundColor: isPressed ? "#e21f26" : "#0b0a0d",
                }}
                transition={{ duration: 0.08 }}
                className="absolute top-0 z-10 h-[62%] rounded-b-md border border-black/40 shadow-lg"
                style={{
                  left: `calc(${idx * whiteWidth}% - ${whiteWidth * 0.26}%)`,
                  width: `${whiteWidth * 0.52}%`,
                }}
              >
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 font-mono text-[9px] uppercase text-ivoire/50">
                  {n.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
      <p className="mt-4 text-center font-mono text-xs uppercase tracking-[0.25em] text-brume-soft">
        Clavier ordinateur ou clic — la touche cerclée est celle du logo
      </p>
    </div>
  );
}
