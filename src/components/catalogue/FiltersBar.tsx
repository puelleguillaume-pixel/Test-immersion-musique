import type { Mood, PackType } from "@/types";
import { cn } from "@/lib/cn";

export interface Filters {
  type: PackType | "all";
  mood: Mood | "all";
  bpmMin: number;
  bpmMax: number;
  search: string;
}

interface FiltersBarProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  moods: Mood[];
  bpmRange: [number, number];
}

const TYPES: Array<{ value: Filters["type"]; label: string }> = [
  { value: "all", label: "Tout" },
  { value: "loop", label: "Loops" },
  { value: "prod", label: "Prods" },
  { value: "topline", label: "Toplines" },
];

export function FiltersBar({ filters, onChange, moods, bpmRange }: FiltersBarProps) {
  return (
    <div className="mb-10 flex flex-col gap-6 rounded-2xl border border-ivoire/10 bg-noir-soft/60 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">
        {TYPES.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => onChange({ ...filters, type: t.value })}
            className={cn(
              "rounded-full border px-4 py-1.5 font-display text-xs uppercase tracking-wide transition-colors",
              filters.type === t.value
                ? "border-cuir-bright bg-cuir-bright/15 text-cuir-bright"
                : "border-ivoire/20 text-ivoire/60 hover:text-ivoire",
            )}
          >
            {t.label}
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
