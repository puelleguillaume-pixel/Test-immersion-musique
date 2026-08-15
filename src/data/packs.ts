import type { Pack } from "@/types";
import { supabase } from "@/lib/supabase";
import { licensesFromBasePrice } from "@/lib/catalogue";

export const packs: Pack[] = [
  {
    id: "p1",
    slug: "verre-rouge",
    title: "Verre Rouge",
    type: "prod",
    bpm: 140,
    key: "F# min",
    mood: ["sombre", "luxueux"],
    coverGradient: ["#b3161c", "#08070a"],
    durationSec: 138,
    waveformSeed: 14,
    licenses: licensesFromBasePrice(35, "p1"),
    tags: ["piano", "trap", "cinématique"],
    createdAt: "2026-06-02",
  },
  {
    id: "p2",
    slug: "reflet-93",
    title: "Reflet 93",
    type: "loop",
    bpm: 92,
    key: "C min",
    mood: ["mélancolique", "planant"],
    coverGradient: ["#5b6b82", "#111014"],
    durationSec: 46,
    waveformSeed: 27,
    licenses: licensesFromBasePrice(22, "p2"),
    tags: ["piano loop", "boom bap"],
    createdAt: "2026-05-18",
  },
  {
    id: "p3",
    slug: "touches-noires",
    title: "Touches Noires",
    type: "prod",
    bpm: 128,
    key: "D min",
    mood: ["agressif", "énergique"],
    coverGradient: ["#e21f26", "#18161c"],
    durationSec: 152,
    waveformSeed: 8,
    licenses: licensesFromBasePrice(38, "p3"),
    tags: ["drill", "piano", "dark"],
    createdAt: "2026-07-01",
  },
  {
    id: "p4",
    slug: "chrome-bleu",
    title: "Chrome Bleu",
    type: "topline",
    bpm: 100,
    key: "A min",
    mood: ["planant", "mélancolique"],
    coverGradient: ["#8a97ab", "#08070a"],
    durationSec: 164,
    waveformSeed: 41,
    licenses: licensesFromBasePrice(45, "p4"),
    tags: ["topline", "mélodie chantée"],
    createdAt: "2026-06-27",
  },
  {
    id: "p5",
    slug: "cuir-clout",
    title: "Cuir Clouté",
    type: "prod",
    bpm: 132,
    key: "G# min",
    mood: ["luxueux", "agressif"],
    coverGradient: ["#b3161c", "#5b6b82"],
    durationSec: 145,
    waveformSeed: 55,
    licenses: licensesFromBasePrice(40, "p5"),
    tags: ["trap", "orchestral", "piano"],
    createdAt: "2026-04-30",
  },
  {
    id: "p6",
    slug: "nocturne-93",
    title: "Nocturne",
    type: "loop",
    bpm: 84,
    key: "E min",
    mood: ["mélancolique", "sombre"],
    coverGradient: ["#18161c", "#5b6b82"],
    durationSec: 38,
    waveformSeed: 63,
    licenses: licensesFromBasePrice(20, "p6"),
    tags: ["piano loop", "rnb"],
    createdAt: "2026-07-20",
  },
  {
    id: "p7",
    slug: "spot-froid",
    title: "Spot Froid",
    type: "prod",
    bpm: 145,
    key: "B min",
    mood: ["énergique", "luxueux"],
    coverGradient: ["#5b6b82", "#e21f26"],
    durationSec: 129,
    waveformSeed: 19,
    licenses: licensesFromBasePrice(37, "p7"),
    tags: ["drill", "cinématique"],
    createdAt: "2026-07-29",
  },
  {
    id: "p8",
    slug: "ivoire",
    title: "Ivoire",
    type: "topline",
    bpm: 96,
    key: "C# min",
    mood: ["mélancolique", "luxueux"],
    coverGradient: ["#f4efe6", "#08070a"],
    durationSec: 171,
    waveformSeed: 33,
    licenses: licensesFromBasePrice(48, "p8"),
    tags: ["topline", "piano", "chant"],
    createdAt: "2026-08-05",
  },
];

export const packBpmRange: [number, number] = [
  Math.min(...packs.map((p) => p.bpm)),
  Math.max(...packs.map((p) => p.bpm)),
];

/**
 * Supabase stores columns in snake_case (idiomatic Postgres); the app works
 * in camelCase. These two functions are the only place that translation
 * happens, so every read/write path (storefront + admin) stays consistent.
 */
interface PackRow {
  id: string;
  slug: string;
  title: string;
  type: Pack["type"];
  bpm: number;
  key: string;
  mood: Pack["mood"];
  cover_gradient: string[];
  duration_sec: number;
  audio_url: string | null;
  waveform_seed: number;
  licenses: Pack["licenses"];
  tags: string[];
  created_at: string;
}

function rowToPack(row: PackRow): Pack {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    type: row.type,
    bpm: row.bpm,
    key: row.key,
    mood: row.mood,
    coverGradient: [row.cover_gradient[0] ?? "#18161c", row.cover_gradient[1] ?? "#08070a"],
    durationSec: row.duration_sec,
    audioUrl: row.audio_url ?? undefined,
    waveformSeed: row.waveform_seed,
    licenses: row.licenses,
    tags: row.tags,
    createdAt: row.created_at,
  };
}

function packToRow(pack: Pack): PackRow {
  return {
    id: pack.id,
    slug: pack.slug,
    title: pack.title,
    type: pack.type,
    bpm: pack.bpm,
    key: pack.key,
    mood: pack.mood,
    cover_gradient: pack.coverGradient,
    duration_sec: pack.durationSec,
    audio_url: pack.audioUrl ?? null,
    waveform_seed: pack.waveformSeed,
    licenses: pack.licenses,
    tags: pack.tags,
    created_at: pack.createdAt,
  };
}

/**
 * Supabase-first: reads from the `packs` table when a project is configured,
 * otherwise serves the local catalogue above so the store works out of the
 * box. New drops just need a row in Supabase (or the /admin catalogue
 * manager) — no front-end change required.
 */
export async function getPacks(): Promise<Pack[]> {
  if (!supabase) return packs;
  const { data, error } = await supabase
    .from("packs")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data || data.length === 0) return packs;
  return (data as PackRow[]).map(rowToPack);
}

/** Requires an authenticated Supabase session (see supabase/migrations/0002). */
export async function createPack(pack: Pack): Promise<void> {
  if (!supabase) throw new Error("Supabase n'est pas configuré.");
  const { error } = await supabase.from("packs").insert(packToRow(pack));
  if (error) throw new Error(error.message);
}

export async function updatePack(pack: Pack): Promise<void> {
  if (!supabase) throw new Error("Supabase n'est pas configuré.");
  const { error } = await supabase.from("packs").update(packToRow(pack)).eq("id", pack.id);
  if (error) throw new Error(error.message);
}

export async function deletePack(id: string): Promise<void> {
  if (!supabase) throw new Error("Supabase n'est pas configuré.");
  const { error } = await supabase.from("packs").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/** Uploads to the public `pack-audio` storage bucket and returns its public URL. */
export async function uploadPackAudio(packId: string, file: File): Promise<string> {
  if (!supabase) throw new Error("Supabase n'est pas configuré.");
  const path = `${packId}/${Date.now()}-${file.name}`;
  const { error } = await supabase.storage.from("pack-audio").upload(path, file, {
    upsert: true,
    contentType: file.type || "audio/mpeg",
  });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from("pack-audio").getPublicUrl(path);
  return data.publicUrl;
}
