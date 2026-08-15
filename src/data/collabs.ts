import type { Collab } from "@/types";
import { supabase } from "@/lib/supabase";

/**
 * Sourced from a screenshot of the "Chansons populaires" section of
 * https://genius.com/artists/Naifos, provided directly by the artist
 * (2026-08-15). This is a partial list — Genius shows an "Afficher toutes
 * les chansons" link, meaning more credits exist; add them here (or, once
 * a Supabase project is wired up, as rows in the `collabs` table) as they're
 * gathered.
 *
 * "BESOIN DE TOI" (feat. FAYV) is marked "(Non publié)" on Genius —
 * deliberately left out of this public wall until the artist decides to
 * announce it. Release years weren't visible in the screenshot, so `year`
 * is left unset rather than guessed.
 */
export const collabs: Collab[] = [
  {
    id: "c1",
    artist: "Ninho",
    track: "Grands ensembles",
    role: "Production",
    accent: ["#b3161c", "#08070a"],
    verified: true,
  },
  {
    id: "c2",
    artist: "Kaneki",
    track: "Jules César",
    role: "Production",
    accent: ["#5b6b82", "#111014"],
    verified: true,
  },
  {
    id: "c3",
    artist: "HOUDI & Anyme023",
    track: "Médicament",
    role: "Production",
    accent: ["#e21f26", "#18161c"],
    verified: true,
  },
  {
    id: "c4",
    artist: "Emkal",
    track: "Oblie-moi",
    role: "Production",
    accent: ["#8a97ab", "#08070a"],
    verified: true,
  },
  {
    id: "c5",
    artist: "Emkal",
    track: "Oblie-moi (Remix)",
    role: "Production",
    accent: ["#18161c", "#5b6b82"],
    verified: true,
  },
  {
    id: "c6",
    artist: "Niro",
    track: "Tous les jours",
    role: "Production",
    accent: ["#b3161c", "#5b6b82"],
    verified: true,
  },
  {
    id: "c7",
    artist: "Niro",
    track: "Plus pareil",
    role: "Production",
    accent: ["#e21f26", "#08070a"],
    verified: true,
  },
  {
    id: "c8",
    artist: "Yaro",
    track: "Lundi",
    role: "Production",
    accent: ["#5b6b82", "#18161c"],
    verified: true,
  },
  {
    id: "c9",
    artist: "Béné (FRA)",
    track: "Marbella",
    role: "Production",
    accent: ["#f4efe6", "#08070a"],
    verified: true,
  },
];

export async function getCollabs(): Promise<Collab[]> {
  if (!supabase) return collabs;
  const { data, error } = await supabase
    .from("collabs")
    .select("*")
    .order("year", { ascending: false, nullsFirst: false });
  if (error || !data || data.length === 0) return collabs;
  return data as unknown as Collab[];
}
