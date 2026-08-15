import { useEffect, useMemo, useState } from "react";
import { Section } from "@/components/ui/Section";
import { FiltersBar, type Filters } from "@/components/catalogue/FiltersBar";
import { PackCard } from "@/components/catalogue/PackCard";
import { getPacks, allMoods, packBpmRange } from "@/data/packs";
import type { Pack } from "@/types";

const INITIAL_FILTERS: Filters = {
  type: "all",
  mood: "all",
  bpmMin: packBpmRange[0],
  bpmMax: packBpmRange[1],
  search: "",
};

export default function Catalogue() {
  const [packs, setPacks] = useState<Pack[] | null>(null);
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);

  useEffect(() => {
    void getPacks().then(setPacks);
  }, []);

  const filtered = useMemo(() => {
    if (!packs) return [];
    return packs.filter((p) => {
      if (filters.type !== "all" && p.type !== filters.type) return false;
      if (filters.mood !== "all" && !p.mood.includes(filters.mood)) return false;
      if (p.bpm > filters.bpmMax) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const haystack = `${p.title} ${p.tags.join(" ")} ${p.key}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [packs, filters]);

  return (
    <Section
      kicker="Store"
      title="Catalogue"
      description="Loops, prods & toplines — licences MP3, WAV, trackout ou exclusivité."
    >
      <FiltersBar filters={filters} onChange={setFilters} moods={allMoods} bpmRange={packBpmRange} />

      {!packs ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-72 animate-pulse rounded-2xl border border-ivoire/10 bg-noir-soft" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="py-16 text-center text-brume-pale/70">
          Aucun résultat pour ces filtres — essaie d'élargir la fourchette de BPM.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((pack, i) => (
            <PackCard key={pack.id} pack={pack} index={i} />
          ))}
        </div>
      )}
    </Section>
  );
}
