import { Suspense, lazy } from "react";
import { useDeviceTier } from "@/hooks/useDeviceTier";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { PianoReflectionFallback } from "./PianoReflectionFallback";

const HeroScene = lazy(() =>
  import("./HeroScene").then((m) => ({ default: m.HeroScene })),
);

export function PianoVisual() {
  const tier = useDeviceTier();
  const reducedMotion = usePrefersReducedMotion();

  if (tier === "lite") {
    return <PianoReflectionFallback />;
  }

  return (
    <Suspense fallback={<PianoReflectionFallback />}>
      <HeroScene reducedMotion={reducedMotion} />
    </Suspense>
  );
}
