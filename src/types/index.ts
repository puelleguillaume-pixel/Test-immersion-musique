export type PackType = "loop" | "prod" | "topline";

export type Mood =
  | "sombre"
  | "mélancolique"
  | "énergique"
  | "luxueux"
  | "planant"
  | "agressif";

export interface License {
  id: string;
  label: string;
  format: "MP3" | "WAV" | "TRACKOUT" | "EXCLUSIVE";
  price: number;
  description: string;
}

export interface Pack {
  id: string;
  slug: string;
  title: string;
  type: PackType;
  bpm: number;
  key: string; // musical key, e.g. "F# min"
  mood: Mood[];
  coverGradient: [string, string];
  durationSec: number;
  audioUrl?: string;
  waveformSeed: number;
  licenses: License[];
  tags: string[];
  createdAt: string;
}

export interface Collab {
  id: string;
  artist: string;
  track: string;
  year?: number;
  role: string;
  accent: [string, string];
  geniusUrl?: string;
  audioUrl?: string;
  verified: boolean;
}

export interface GalleryImage {
  id: string;
  caption: string;
  gradient: [string, string];
}

export interface CartItem {
  packId: string;
  licenseId: string;
}

export interface CheckoutPayload {
  email: string;
  items: Array<{
    packTitle: string;
    licenseLabel: string;
    price: number;
    packId: string;
    licenseId: string;
  }>;
  total: number;
}
