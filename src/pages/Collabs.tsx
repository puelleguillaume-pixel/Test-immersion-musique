import { useEffect, useState } from "react";
import { Section } from "@/components/ui/Section";
import { CollabWall } from "@/components/collabs/CollabWall";
import { ImageStreamHero } from "@/components/ui/image-stream-hero";
import { getCollabs, collabs as seedCollabs } from "@/data/collabs";
import { coverPlaceholder } from "@/lib/coverPlaceholder";
import type { Collab } from "@/types";

const GENIUS_URL = import.meta.env.VITE_GENIUS_URL ?? "https://genius.com/artists/Naifos";

// Decorative only (the corridor is aria-hidden), so it's fine for this to
// run off the seed list rather than waiting on the async Supabase fetch
// below — real cover art isn't ours to redistribute without the rights
// holder's OK (see README), so each card is a gradient built from that
// collab's own accent colors instead of a photo.
const CORRIDOR_IMAGES = seedCollabs.map((c) => ({
  src: coverPlaceholder(c.accent[0], c.accent[1], c.artist),
  alt: `${c.artist} — ${c.track}`,
}));

export default function Collabs() {
  const [collabs, setCollabs] = useState<Collab[] | null>(null);

  useEffect(() => {
    void getCollabs().then(setCollabs);
  }, []);

  return (
    <div>
      <div className="px-6 pt-10 sm:px-10 lg:px-16">
        <ImageStreamHero
          images={CORRIDOR_IMAGES}
          cards={CORRIDOR_IMAGES.length}
          className="h-[420px] w-full rounded-3xl border border-ivoire/10 bg-noir-soft shadow-red-glow sm:h-[480px]"
        >
          <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-cuir-bright">
              {seedCollabs.length} crédits Genius
            </p>
            <h1 className="max-w-lg font-display text-3xl font-semibold leading-tight text-ivoire sm:text-4xl">
              Le piano de Naifos, dans les prods des autres.
            </h1>
          </div>
        </ImageStreamHero>
      </div>

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
    </div>
  );
}
