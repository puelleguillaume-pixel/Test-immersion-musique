import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PianoVisual } from "@/components/three/PianoVisual";
import { InteractivePiano } from "@/components/piano/InteractivePiano";
import { WaveformPlayer } from "@/components/catalogue/WaveformPlayer";
import { PackCard } from "@/components/catalogue/PackCard";
import { CollabTile } from "@/components/collabs/CollabTile";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/Button";
import { Marquee } from "@/components/ui/Marquee";
import { packs } from "@/data/packs";
import { collabs } from "@/data/collabs";
import { beats, grooveEase } from "@/lib/tempo";

const featured = packs.slice(0, 3);
const featuredCollabs = collabs.slice(0, 4);

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden">
        <PianoVisual />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-noir via-noir/40 to-noir/10" />

        <div className="relative z-10 px-6 pb-20 pt-40 sm:px-10 lg:px-16">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: beats(1), ease: grooveEase, delay: beats(0.3) }}
            className="mb-4 font-mono text-xs uppercase tracking-[0.35em] text-cuir-bright"
          >
            Pianiste devenu producteur
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: beats(1.2), ease: grooveEase, delay: beats(0.5) }}
            className="max-w-3xl font-display text-5xl font-bold leading-[0.95] text-ivoire sm:text-6xl lg:text-7xl"
          >
            Le piano, vu <span className="text-outline">en reflet.</span>
            <br />
            La prod, comme <span className="text-cuir-bright">signature.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: beats(1), ease: grooveEase, delay: beats(0.9) }}
            className="mt-6 max-w-lg text-brume-pale/90"
          >
            Naifos compose des loops, prods et toplines pour la scène rap française — un pont
            entre la formation classique et la culture urbaine, jamais l'un sans l'autre.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: beats(1), ease: grooveEase, delay: beats(1.2) }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <LinkButton to="/catalogue">Explorer le catalogue</LinkButton>
            <Link
              to="/collabs"
              className="font-display text-sm uppercase tracking-wide text-ivoire/70 underline decoration-cuir-bright/50 underline-offset-4 hover:text-ivoire"
            >
              Voir les collaborations
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: beats(1), delay: beats(1.6) }}
            className="mt-12 max-w-md"
          >
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.25em] text-brume-soft">
              Extrait — {featured[0].title}
            </p>
            <WaveformPlayer id="hero-featured" audioUrl={featured[0].audioUrl} seed={featured[0].waveformSeed} />
          </motion.div>
        </div>
      </section>

      <Marquee
        items={["LOOPS", "PRODS", "TOPLINES", "PIANO", "TRAP", "DRILL", "93 BPM"]}
        className="border-y border-ivoire/10 bg-noir-soft py-4"
      />

      {/* Piano interactif */}
      <Section
        kicker="Signature sonore"
        title="Le piano n'est jamais montré brut."
        description="Il apparaît en reflet, en fragments, en son. Ici, il se joue — quelques touches, une idée de ce qui se passe en session."
      >
        <Reveal>
          <InteractivePiano />
        </Reveal>
      </Section>

      {/* Featured packs */}
      <Section
        kicker="Catalogue"
        title="Loops, prods & toplines"
        description="Une sélection — le catalogue complet se filtre par BPM, tonalité, mood et type."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((pack, i) => (
            <PackCard key={pack.id} pack={pack} index={i} />
          ))}
        </div>
        <Reveal className="mt-10 text-center" delay={0.3}>
          <LinkButton to="/catalogue" variant="outline">
            Voir tout le catalogue
          </LinkButton>
        </Reveal>
      </Section>

      {/* Collabs preview */}
      <Section
        kicker="Discographie"
        title="Le mur des collabs"
        description="Une partie des crédits Genius de Naifos — cliquer une vignette ouvre le morceau."
        className="bg-noir-soft/40"
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {featuredCollabs.map((c, i) => (
            <CollabTile key={c.id} collab={c} index={i} onHover={() => {}} onSelect={() => {}} />
          ))}
        </div>
        <Reveal className="mt-10 text-center" delay={0.3}>
          <LinkButton to="/collabs" variant="outline">
            Voir toutes les collaborations
          </LinkButton>
        </Reveal>
      </Section>

      {/* CTA */}
      <Section>
        <Reveal className="flex flex-col items-center gap-6 rounded-3xl border border-ivoire/10 bg-key-gradient px-8 py-16 text-center shadow-red-glow">
          <h2 className="font-display text-3xl font-semibold text-ivoire sm:text-4xl">
            Un projet, un morceau, une date ?
          </h2>
          <p className="max-w-md text-brume-pale/80">
            Booking, prods sur-mesure, presse — parlons-en.
          </p>
          <LinkButton to="/contact">Contact &amp; booking</LinkButton>
        </Reveal>
      </Section>
    </div>
  );
}
