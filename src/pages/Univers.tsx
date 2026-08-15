import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { PhotoGallery } from "@/components/about/PhotoGallery";
import { gallery } from "@/data/gallery";

const TIMELINE = [
  {
    year: "Conservatoire",
    title: "Les gammes, avant tout",
    text: "Des années de piano classique — la théorie, l'oreille, la discipline du geste. La base de tout ce qui suit.",
  },
  {
    year: "Premiers beats",
    title: "Le clavier devient MIDI",
    text: "Les mêmes doigts, un nouvel outil. Le piano acoustique laisse place au clavier maître, la partition à la DAW.",
  },
  {
    year: "Studio",
    title: "Rencontre avec le rap",
    text: "Premières sessions avec des rappeurs de la scène française. Le piano s'invite dans des instrus qui ne l'attendaient pas.",
  },
  {
    year: "Aujourd'hui",
    title: "Pianiste-producteur",
    text: "Un catalogue de loops, prods et toplines, des crédits qui s'accumulent, un son reconnaissable — le piano en reflet dans le rap.",
  },
];

export default function Univers() {
  return (
    <div>
      <Section
        kicker="Univers"
        title="Du conservatoire au studio"
        description="Naifos n'est pas un beatmaker qui a appris deux accords. C'est un pianiste qui a choisi la prod comme instrument."
      >
        <div className="relative space-y-10 border-l border-ivoire/15 pl-8">
          {TIMELINE.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.15} className="relative">
              <span className="absolute -left-[41px] top-1 h-3 w-3 rounded-full border-2 border-cuir-bright bg-noir" />
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-cuir-bright">{step.year}</p>
              <h3 className="mt-1 font-display text-xl font-semibold text-ivoire">{step.title}</h3>
              <p className="mt-2 max-w-xl text-brume-pale/80">{step.text}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section kicker="Galerie" title="Studio, scène, portraits" className="bg-noir-soft/40">
        <PhotoGallery images={gallery} />
      </Section>
    </div>
  );
}
