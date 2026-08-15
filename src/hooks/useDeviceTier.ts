import { useEffect, useState } from "react";

export type DeviceTier = "full" | "lite";

/**
 * Decides whether the visitor gets the full Three.js hero scene or the
 * static/CSS fallback. Small screens, coarse pointers (touch) and devices
 * that advertise few cores are steered to the lite path so the immersive
 * scene never becomes the thing that makes the site janky on a mid-range phone.
 */
export function useDeviceTier(): DeviceTier {
  const [tier, setTier] = useState<DeviceTier>("full");

  useEffect(() => {
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const smallViewport = window.innerWidth < 768;
    const lowCores =
      typeof navigator.hardwareConcurrency === "number" &&
      navigator.hardwareConcurrency > 0 &&
      navigator.hardwareConcurrency <= 4;
    const saveData = (navigator as any).connection?.saveData === true;

    if ((coarsePointer && smallViewport) || (coarsePointer && lowCores) || saveData) {
      setTier("lite");
    } else {
      setTier("full");
    }
  }, []);

  return tier;
}
