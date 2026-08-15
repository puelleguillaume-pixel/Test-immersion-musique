import type { License, Mood, PackType } from "@/types";

export const PACK_TYPE_OPTIONS: PackType[] = ["loop", "prod", "topline"];

export const PACK_TYPE_LABEL: Record<PackType, string> = {
  loop: "Loop",
  prod: "Prod",
  topline: "Topline",
};

export const MOOD_OPTIONS: Mood[] = [
  "sombre",
  "mélancolique",
  "énergique",
  "luxueux",
  "planant",
  "agressif",
];

/** Multiplier applied to the MP3 price to suggest the other three tiers. */
export const LICENSE_MULTIPLIERS: Record<License["format"], number> = {
  MP3: 1,
  WAV: 1.8,
  TRACKOUT: 3.4,
  EXCLUSIVE: 9,
};

export const LICENSE_TEMPLATE: Array<Pick<License, "label" | "format" | "description">> = [
  {
    label: "MP3 Lease",
    format: "MP3",
    description: "Usage non exclusif, streaming & clips jusqu'à 50k vues, tag audio inclus.",
  },
  {
    label: "WAV Lease",
    format: "WAV",
    description: "Qualité studio sans tag, distribution illimitée en streaming.",
  },
  {
    label: "Trackout",
    format: "TRACKOUT",
    description: "Toutes les pistes séparées (stems) pour un mix/mastering sur-mesure.",
  },
  {
    label: "Exclusivité",
    format: "EXCLUSIVE",
    description: "Droits exclusifs, retrait immédiat de la vente, contrat cédé.",
  },
];

/** Builds the 4 standard license tiers from a single MP3 base price. */
export function licensesFromBasePrice(basePrice: number, packId: string): License[] {
  return LICENSE_TEMPLATE.map((tpl) => ({
    id: `${packId}-${tpl.format.toLowerCase()}`,
    label: tpl.label,
    format: tpl.format,
    description: tpl.description,
    price: Math.round(basePrice * LICENSE_MULTIPLIERS[tpl.format]),
  }));
}
