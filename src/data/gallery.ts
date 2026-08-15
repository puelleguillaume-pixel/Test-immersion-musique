import type { GalleryImage } from "@/types";

/**
 * ⚠️ PLACEHOLDER — gradient tiles stand in for real studio/scène/portrait
 * photography. Drop real images (Supabase Storage or /public) and swap the
 * `PhotoGallery` component to render them instead of the gradient div.
 */
export const gallery: GalleryImage[] = [
  { id: "g1", caption: "Studio — session piano, 3h du matin", gradient: ["#b3161c", "#08070a"] },
  { id: "g2", caption: "Backstage avant set", gradient: ["#5b6b82", "#111014"] },
  { id: "g3", caption: "Prise de son, touches noires", gradient: ["#e21f26", "#18161c"] },
  { id: "g4", caption: "Portrait — spot froid", gradient: ["#8a97ab", "#08070a"] },
  { id: "g5", caption: "Console, fin de session", gradient: ["#18161c", "#b3161c"] },
  { id: "g6", caption: "Scène — lumière rouge", gradient: ["#e21f26", "#5b6b82"] },
];
