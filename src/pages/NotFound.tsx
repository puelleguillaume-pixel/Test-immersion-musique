import { LinkButton } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-cuir-bright">404</p>
      <h1 className="mt-4 font-display text-4xl font-bold text-ivoire sm:text-5xl">
        Cette touche ne joue rien.
      </h1>
      <p className="mt-4 max-w-sm text-brume-pale/70">
        La page cherchée n'existe pas, ou plus.
      </p>
      <LinkButton to="/" className="mt-8">
        Retour à l'accueil
      </LinkButton>
    </div>
  );
}
