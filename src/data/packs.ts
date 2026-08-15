import type { License, Pack } from "@/types";
import { supabase } from "@/lib/supabase";

function licenseSet(base: number, id: string): License[] {
  return [
    {
      id: `${id}-mp3`,
      label: "MP3 Lease",
      format: "MP3",
      price: base,
      description: "Usage non exclusif, streaming & clips jusqu'à 50k vues, tag audio inclus.",
    },
    {
      id: `${id}-wav`,
      label: "WAV Lease",
      format: "WAV",
      price: Math.round(base * 1.8),
      description: "Qualité studio sans tag, distribution illimitée en streaming.",
    },
    {
      id: `${id}-trackout`,
      label: "Trackout",
      format: "TRACKOUT",
      price: Math.round(base * 3.4),
      description: "Toutes les pistes séparées (stems) pour un mix/mastering sur-mesure.",
    },
    {
      id: `${id}-exclusive`,
      label: "Exclusivité",
      format: "EXCLUSIVE",
      price: Math.round(base * 9),
      description: "Droits exclusifs, retrait immédiat de la vente, contrat cédé.",
    },
  ];
}

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
    licenses: licenseSet(35, "p1"),
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
    licenses: licenseSet(22, "p2"),
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
    licenses: licenseSet(38, "p3"),
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
    licenses: licenseSet(45, "p4"),
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
    licenses: licenseSet(40, "p5"),
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
    licenses: licenseSet(20, "p6"),
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
    licenses: licenseSet(37, "p7"),
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
    licenses: licenseSet(48, "p8"),
    tags: ["topline", "piano", "chant"],
    createdAt: "2026-08-05",
  },
];

const BPM_MIN = Math.min(...packs.map((p) => p.bpm));
const BPM_MAX = Math.max(...packs.map((p) => p.bpm));
export const packBpmRange: [number, number] = [BPM_MIN, BPM_MAX];

export const allMoods = Array.from(new Set(packs.flatMap((p) => p.mood)));
export const allKeys = Array.from(new Set(packs.map((p) => p.key)));

/**
 * Supabase-first: reads from a `packs` table (see supabase/migrations) when a
 * project is configured, otherwise serves the local catalogue above so the
 * store works out of the box. New drops just need a row in Supabase — no
 * front-end change required.
 */
export async function getPacks(): Promise<Pack[]> {
  if (!supabase) return packs;
  const { data, error } = await supabase
    .from("packs")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data || data.length === 0) return packs;
  return data as unknown as Pack[];
}
