import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { BookingForm } from "@/components/contact/BookingForm";

const instagram = import.meta.env.VITE_INSTAGRAM_HANDLE ?? "__naifos";
const genius = import.meta.env.VITE_GENIUS_URL ?? "https://genius.com/artists/Naifos";

export default function Contact() {
  return (
    <Section
      kicker="Contact"
      title="Booking & collaborations"
      description="Pour une date, une prod sur-mesure ou une demande presse — un message suffit."
    >
      <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
        <Reveal>
          <div className="space-y-6">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-brume-soft">Réseaux</p>
              <a
                href={`https://instagram.com/${instagram}`}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-2 block font-display text-lg text-ivoire hover:text-cuir-bright"
              >
                Instagram — @{instagram}
              </a>
              <a
                href={genius}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-1 block font-display text-lg text-ivoire hover:text-cuir-bright"
              >
                Genius — crédits & discographie
              </a>
            </div>
            <p className="max-w-sm text-sm text-brume-pale/70">
              Réponse sous 48h en général. Pour un booking, précise la date et le lieu ; pour une
              prod sur-mesure, précise le mood, le BPM et une référence si tu en as une.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <BookingForm />
        </Reveal>
      </div>
    </Section>
  );
}
