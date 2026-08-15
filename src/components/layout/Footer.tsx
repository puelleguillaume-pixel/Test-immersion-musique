import { Link } from "react-router-dom";

const instagram = import.meta.env.VITE_INSTAGRAM_HANDLE ?? "__naifos";
const genius = import.meta.env.VITE_GENIUS_URL ?? "https://genius.com/artists/Naifos";

export function Footer() {
  return (
    <footer className="relative border-t border-ivoire/10 bg-noir px-6 py-16 sm:px-10 lg:px-16">
      <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl font-bold tracking-[0.2em] text-ivoire">
            NAIF<span className="text-cuir-bright">O</span>S
          </p>
          <p className="mt-4 max-w-sm text-sm text-brume-pale/70">
            Pianiste de formation, producteur de musique urbaine. Loops, prods et toplines
            composés entre deux mondes — le clavier et la rue.
          </p>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-brume-soft">Site</p>
          <ul className="mt-4 space-y-2 text-sm text-ivoire/70">
            <li><Link to="/catalogue" className="hover:text-cuir-bright">Catalogue</Link></li>
            <li><Link to="/collabs" className="hover:text-cuir-bright">Collaborations</Link></li>
            <li><Link to="/univers" className="hover:text-cuir-bright">Univers</Link></li>
            <li><Link to="/contact" className="hover:text-cuir-bright">Contact / Booking</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-brume-soft">Réseaux</p>
          <ul className="mt-4 space-y-2 text-sm text-ivoire/70">
            <li>
              <a
                href={`https://instagram.com/${instagram}`}
                target="_blank"
                rel="noreferrer noopener"
                className="hover:text-cuir-bright"
              >
                Instagram @{instagram}
              </a>
            </li>
            <li>
              <a href={genius} target="_blank" rel="noreferrer noopener" className="hover:text-cuir-bright">
                Genius — crédits
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-ivoire/10 pt-6 text-xs text-brume-soft sm:flex-row sm:items-center">
        <p>© {new Date().getFullYear()} Naifos. Tous droits réservés.</p>
        <p className="font-mono">90 BPM · piano en reflet</p>
      </div>
    </footer>
  );
}
