import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * The cursor is a tiny black/white piano key sliver — a nod to the "piano
 * seen in reflection" motif, echoed here in the one place the visitor's own
 * movement drives the piano imagery. Disabled on touch devices and under
 * prefers-reduced-motion, where the system cursor takes over.
 */
export function CustomCursor() {
  const reduced = usePrefersReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [hoveringLink, setHoveringLink] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 700, damping: 42, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 700, damping: 42, mass: 0.4 });
  const raf = useRef<number>();

  useEffect(() => {
    const isFine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    setEnabled(isFine && !reduced);
  }, [reduced]);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("cursor-ready");

    const move = (e: MouseEvent) => {
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        x.set(e.clientX - 8);
        y.set(e.clientY - 14);
        const target = e.target as HTMLElement;
        setHoveringLink(Boolean(target.closest("a,button,[role='button'],input,select")));
      });
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    return () => {
      document.documentElement.classList.remove("cursor-ready");
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[70]"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        animate={{
          scale: pressed ? 0.8 : hoveringLink ? 1.4 : 1,
          rotate: hoveringLink ? -18 : 0,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="flex h-7 w-3 overflow-hidden rounded-[2px] border border-ivoire/40 shadow-red-glow"
      >
        <span className="h-full w-1/2 bg-ivoire" />
        <span className="h-full w-1/2 bg-noir" />
      </motion.div>
    </motion.div>
  );
}
