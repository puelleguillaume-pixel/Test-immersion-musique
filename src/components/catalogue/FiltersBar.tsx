import type { Mood, PackType } from "@/types";
import { cn } from "@/lib/cn";
import { PACK_TYPE_OPTIONS, PACK_TYPE_LABEL } from "@/lib/catalogue";

export interface Filters {
  type: PackType | "all";
  mood: Mood | "all";
  key: string | "all";
  bpmMin: number;
  bpmMax: number;
  search: string;
}

interface FiltersBarProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  moods: Mood[];
  keys: string[];
  bpmRange: [number, number];
}

export function FiltersBar({ filters, onChange, moods, keys, bpmRange }: FiltersBarProps) {
  return (
    <div className="mb-10 flex flex-col gap-6 rounded-2xl border border-ivoire/10 bg-noir-soft/60 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange({ ...filters, type: "all" })}
          className={cn(
            "rounded-full border px-4 py-1.5 font-display text-xs uppercase tracking-wide transition-colors",
            filters.type === "all"
              ? "border-cuir-bright bg-cuir-bright/15 text-cuir-bright"
              : "border-ivoire/20 text-ivoire/60 hover:text-ivoire",
          )}
        >
          Tout
        </button>
        {PACK_TYPE_OPTIONS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => onChange({ ...filters, type: t })}
            className={cn(
              "rounded-full border px-4 py-1.5 font-display text-xs uppercase tracking-wide transition-colors",
              filters.type === t
                ? "border-cuir-bright bg-cuir-bright/15 text-cuir-bright"
                : "border-ivoire/20 text-ivoire/60 hover:text-ivoire",
            )}
          >
            {PACK_TYPE_LABEL[t]}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-xs text-brume-pale">
          <span className="font-mono uppercase tracking-wide">Mood</span>
          <select
            value={filters.mood}
            onChange={(e) => onChange({ ...filters, mood: e.target.value as Filters["mood"] })}
            className="rounded-full border border-ivoire/20 bg-noir px-3 py-1.5 text-ivoire outline-none focus:border-cuir-bright"
          >
            <option value="all">Tous</option>
            {moods.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 text-xs text-brume-pale">
          <span className="font-mono uppercase tracking-wide">Tonalité</span>
          <select
            value={filters.key}
            onChange={(e) => onChange({ ...filters, key: e.target.value })}
            className="rounded-full border border-ivoire/20 bg-noir px-3 py-1.5 text-ivoire outline-none focus:border-cuir-bright"
          >
            <option value="all">Toutes</option>
            {keys.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 text-xs text-brume-pale">
          <span className="font-mono uppercase tracking-wide">
            BPM {filters.bpmMin}–{filters.bpmMax}
          </span>
          <input
            type="range"
            min={bpmRange[0]}
            max={bpmRange[1]}
            value={filters.bpmMax}
            onChange={(e) => onChange({ ...filters, bpmMax: Number(e.target.value) })}
            className="accent-cuir-bright"
          />
        </label>

        <input
          type="search"
          placeholder="Rechercher…"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className="w-40 rounded-full border border-ivoire/20 bg-noir px-4 py-1.5 text-xs text-ivoire outline-none placeholder:text-brume-soft focus:border-cuir-bright"
        />
      </div>
    </div>
  );
}
