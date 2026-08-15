import type { Collab } from "@/types";
import { supabase } from "@/lib/supabase";

/**
 * ⚠️ PLACEHOLDER DATA — replace before launch.
 *
 * The brief asks for the "collab wall" to be sourced from Naifos' real
 * Genius credits (https://genius.com/artists/Naifos). This build environment
 * has no network access to Genius, so shipping real, unverified names here
 * would risk misattributing work to real artists. The entries below use
 * invented placeholder artist names purely to ship a working, styled wall —
 * swap them for the verified Genius credits (or point `getCollabs` at a
 * populated Supabase `collabs` table) before this goes live. See README.
 */
export const collabs: Collab[] = [
  {
    id: "c1",
    artist: "Kaïro V.",
    track: "Nuit Blanche",
    year: 2025,
    role: "Production & piano",
    accent: ["#b3161c", "#08070a"],
    verified: false,
  },
  {
    id: "c2",
    artist: "Selim Nova",
    track: "Cristal",
    year: 2024,
    role: "Production",
    accent: ["#5b6b82", "#111014"],
    verified: false,
  },
  {
    id: "c3",
    artist: "Draye",
    track: "Sang Froid",
    year: 2025,
    role: "Piano additionnel",
    accent: ["#e21f26", "#18161c"],
    verified: false,
  },
  {
    id: "c4",
    artist: "Anaëlle K.",
    track: "Ivoire & Or",
    year: 2023,
    role: "Co-écriture & production",
    accent: ["#8a97ab", "#08070a"],
    verified: false,
  },
  {
    id: "c5",
    artist: "Ryzen",
    track: "Silence Radio",
    year: 2025,
    role: "Production",
    accent: ["#b3161c", "#5b6b82"],
    verified: false,
  },
  {
    id: "c6",
    artist: "Voks",
    track: "Cœur Blindé",
    year: 2024,
    role: "Topline & production",
    accent: ["#18161c", "#e21f26"],
    verified: false,
  },
  {
    id: "c7",
    artist: "Miel Noir",
    track: "Reflets",
    year: 2023,
    role: "Piano & arrangement",
    accent: ["#f4efe6", "#08070a"],
    verified: false,
  },
  {
    id: "c8",
    artist: "Théo Larone",
    track: "93 Nocturne",
    year: 2025,
    role: "Production",
    accent: ["#5b6b82", "#b3161c"],
    verified: false,
  },
];

export async function getCollabs(): Promise<Collab[]> {
  if (!supabase) return collabs;
  const { data, error } = await supabase
    .from("collabs")
    .select("*")
    .order("year", { ascending: false });
  if (error || !data || data.length === 0) return collabs;
  return data as unknown as Collab[];
}
