import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import type { License, Pack, PackType, Mood } from "@/types";
import { createPack, updatePack, uploadPackAudio } from "@/data/packs";
import { PACK_TYPE_OPTIONS, PACK_TYPE_LABEL, MOOD_OPTIONS, LICENSE_TEMPLATE } from "@/lib/catalogue";
import { uniqueSlug } from "@/lib/slugify";
import { Button } from "@/components/ui/Button";
import { beats, grooveEase } from "@/lib/tempo";

interface PackFormProps {
  pack: Pack | null; // null = create mode
  onSaved: () => void;
  onCancel: () => void;
}

function pricesFromLicenses(licenses: License[] | undefined): Record<License["format"], number> {
  const prices: Record<License["format"], number> = { MP3: 25, WAV: 45, TRACKOUT: 85, EXCLUSIVE: 225 };
  for (const license of licenses ?? []) {
    prices[license.format] = license.price;
  }
  return prices;
}

export function PackForm({ pack, onSaved, onCancel }: PackFormProps) {
  const [title, setTitle] = useState(pack?.title ?? "");
  const [type, setType] = useState<PackType>(pack?.type ?? "prod");
  const [bpm, setBpm] = useState(pack?.bpm ?? 120);
  const [key, setKey] = useState(pack?.key ?? "C min");
  const [mood, setMood] = useState<Mood[]>(pack?.mood ?? []);
  const [tags, setTags] = useState(pack?.tags.join(", ") ?? "");
  const [gradientA, setGradientA] = useState(pack?.coverGradient[0] ?? "#b3161c");
  const [gradientB, setGradientB] = useState(pack?.coverGradient[1] ?? "#08070a");
  const [durationSec, setDurationSec] = useState(pack?.durationSec ?? 120);
  const [prices, setPrices] = useState(pricesFromLicenses(pack?.licenses));
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const existingAudioUrl = pack?.audioUrl;
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const toggleMood = (m: Mood) => {
    setMood((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  };

  const handleAudioChange = (file: File | null) => {
    setAudioFile(file);
    if (!file) return;
    const url = URL.createObjectURL(file);
    const probe = new Audio(url);
    probe.addEventListener("loadedmetadata", () => {
      if (Number.isFinite(probe.duration)) setDurationSec(Math.round(probe.duration));
      URL.revokeObjectURL(url);
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Le titre est obligatoire.");
      return;
    }
    setStatus("saving");
    setError(null);
    try {
      const id = pack?.id ?? crypto.randomUUID();
      const slug = pack?.slug ?? uniqueSlug(title);

      let audioUrl = existingAudioUrl;
      if (audioFile) {
        audioUrl = await uploadPackAudio(id, audioFile);
      }

      const licenses: License[] = LICENSE_TEMPLATE.map((tpl) => ({
        id: `${id}-${tpl.format.toLowerCase()}`,
        label: tpl.label,
        format: tpl.format,
        description: tpl.description,
        price: prices[tpl.format],
      }));

      const nextPack: Pack = {
        id,
        slug,
        title: title.trim(),
        type,
        bpm,
        key,
        mood,
        coverGradient: [gradientA, gradientB],
        durationSec,
        audioUrl,
        waveformSeed: pack?.waveformSeed ?? Math.floor(Math.random() * 1000),
        licenses,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        createdAt: pack?.createdAt ?? new Date().toISOString(),
      };

      if (pack) {
        await updatePack(nextPack);
      } else {
        await createPack(nextPack);
      }
      onSaved();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Erreur lors de l'enregistrement.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: beats(0.6), ease: grooveEase }}
      className="rounded-2xl border border-ivoire/10 bg-noir-soft p-6"
    >
      <h2 className="mb-6 font-display text-xl font-semibold text-ivoire">
        {pack ? `Modifier — ${pack.title}` : "Nouveau pack"}
      </h2>

      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-brume-soft">
              Titre
            </span>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-ivoire/20 bg-noir px-4 py-2.5 text-sm text-ivoire outline-none focus:border-cuir-bright"
            />
          </label>

          <label className="block">
            <span className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-brume-soft">
              Type
            </span>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as PackType)}
              className="w-full rounded-lg border border-ivoire/20 bg-noir px-4 py-2.5 text-sm text-ivoire outline-none focus:border-cuir-bright"
            >
              {PACK_TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {PACK_TYPE_LABEL[t]}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-brume-soft">
              BPM
            </span>
            <input
              required
              type="number"
              min={40}
              max={220}
              value={bpm}
              onChange={(e) => setBpm(Number(e.target.value))}
              className="w-full rounded-lg border border-ivoire/20 bg-noir px-4 py-2.5 text-sm text-ivoire outline-none focus:border-cuir-bright"
            />
          </label>

          <label className="block">
            <span className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-brume-soft">
              Tonalité
            </span>
            <input
              required
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="ex. F# min"
              className="w-full rounded-lg border border-ivoire/20 bg-noir px-4 py-2.5 text-sm text-ivoire outline-none focus:border-cuir-bright"
            />
          </label>

          <label className="block">
            <span className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-brume-soft">
              Durée (secondes)
            </span>
            <input
              required
              type="number"
              min={1}
              value={durationSec}
              onChange={(e) => setDurationSec(Number(e.target.value))}
              className="w-full rounded-lg border border-ivoire/20 bg-noir px-4 py-2.5 text-sm text-ivoire outline-none focus:border-cuir-bright"
            />
          </label>

          <label className="block">
            <span className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-brume-soft">
              Tags (séparés par des virgules)
            </span>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="piano, trap, cinématique"
              className="w-full rounded-lg border border-ivoire/20 bg-noir px-4 py-2.5 text-sm text-ivoire outline-none focus:border-cuir-bright"
            />
          </label>
        </div>

        <div>
          <span className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-brume-soft">
            Mood
          </span>
          <div className="flex flex-wrap gap-2">
            {MOOD_OPTIONS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => toggleMood(m)}
                className={`rounded-full border px-3 py-1.5 text-xs capitalize transition-colors ${
                  mood.includes(m)
                    ? "border-cuir-bright bg-cuir-bright/15 text-cuir-bright"
                    : "border-ivoire/20 text-ivoire/60 hover:text-ivoire"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-brume-soft">
              Couleur cover (1)
            </span>
            <input
              type="color"
              value={gradientA}
              onChange={(e) => setGradientA(e.target.value)}
              className="h-11 w-full rounded-lg border border-ivoire/20 bg-noir"
            />
          </label>
          <label className="block">
            <span className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-brume-soft">
              Couleur cover (2)
            </span>
            <input
              type="color"
              value={gradientB}
              onChange={(e) => setGradientB(e.target.value)}
              className="h-11 w-full rounded-lg border border-ivoire/20 bg-noir"
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-brume-soft">
            Fichier audio (mp3/wav) {existingAudioUrl && !audioFile && "— un fichier existe déjà, choisir un nouveau pour le remplacer"}
          </span>
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => handleAudioChange(e.target.files?.[0] ?? null)}
            className="w-full rounded-lg border border-ivoire/20 bg-noir px-4 py-2.5 text-sm text-ivoire outline-none file:mr-4 file:rounded-full file:border-0 file:bg-cuir file:px-4 file:py-1.5 file:text-xs file:uppercase file:text-ivoire"
          />
        </label>

        <div>
          <span className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-brume-soft">
            Prix par licence (€)
          </span>
          <div className="grid gap-3 sm:grid-cols-2">
            {LICENSE_TEMPLATE.map((tpl) => (
              <div
                key={tpl.format}
                className="flex items-center justify-between gap-3 rounded-lg border border-ivoire/10 bg-noir px-4 py-3"
              >
                <span className="text-sm text-ivoire">{tpl.label}</span>
                <input
                  type="number"
                  min={0}
                  value={prices[tpl.format]}
                  onChange={(e) =>
                    setPrices((p) => ({ ...p, [tpl.format]: Number(e.target.value) }))
                  }
                  className="w-24 rounded-md border border-ivoire/20 bg-noir-soft px-3 py-1.5 text-right text-sm text-ivoire outline-none focus:border-cuir-bright"
                />
              </div>
            ))}
          </div>
        </div>

        {error && <p className="text-xs text-cuir-bright">{error}</p>}

        <div className="flex gap-3">
          <Button type="submit" disabled={status === "saving"}>
            {status === "saving" ? "Enregistrement…" : "Enregistrer"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
