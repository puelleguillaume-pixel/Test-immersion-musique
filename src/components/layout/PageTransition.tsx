import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { beats, grooveEase } from "@/lib/tempo";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export function PageTransition({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, clipPath: "inset(0% 0% 8% 0%)" }}
      animate={{ opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)" }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: beats(1.2), ease: grooveEase }}
    >
      {children}
    </motion.div>
  );
}
