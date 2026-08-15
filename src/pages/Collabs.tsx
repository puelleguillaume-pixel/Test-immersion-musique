import { useEffect, useState } from "react";
import { Section } from "@/components/ui/Section";
import { CollabWall } from "@/components/collabs/CollabWall";
import { getCollabs } from "@/data/collabs";
import type { Collab } from "@/types";

const GENIUS_URL = import.meta.env.VITE_GENIUS_URL ?? "https://genius.com/artists/Naifos";

export default function Collabs() {
  const [collabs, setCollabs] = useState<Collab[] | null>(null);

  useEffect(() => {
    void getCollabs().then(setCollabs);
  }, []);

  return (
    <Section
      kicker="Discographie"
      title="Le mur des collabs"
      description="Une partie des morceaux produits ou co-écrits par Naifos pour la scène rap française. Clique une vignette pour ouvrir le morceau."
    >
      {!collabs ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded-xl border border-ivoire/10 bg-noir-soft" />
          ))}
        </div>
      ) : (
        <CollabWall collabs={collabs} />
      )}

      <p className="mt-12 text-center text-sm text-brume-soft">
        Crédits complets et à jour sur{" "}
        <a href={GENIUS_URL} target="_blank" rel="noreferrer noopener" className="text-cuir-bright hover:underline">
          Genius
        </a>
        .
      </p>
    </Section>
  );
}
