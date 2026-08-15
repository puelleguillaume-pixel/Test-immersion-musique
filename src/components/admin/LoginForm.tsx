import { useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setStatus("loading");
    setError(null);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setStatus("error");
      setError(signInError.message);
      return;
    }
    setStatus("idle");
  };

  return (
    <div className="mx-auto max-w-sm">
      <p className="mb-2 font-mono text-xs uppercase tracking-[0.25em] text-cuir-bright">
        Espace artiste
      </p>
      <h1 className="mb-8 font-display text-2xl font-semibold text-ivoire">Connexion</h1>
      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
        <label className="block">
          <span className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-brume-soft">
            Email
          </span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-ivoire/20 bg-noir-soft px-4 py-3 text-sm text-ivoire outline-none focus:border-cuir-bright"
          />
        </label>
        <label className="block">
          <span className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-brume-soft">
            Mot de passe
          </span>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-ivoire/20 bg-noir-soft px-4 py-3 text-sm text-ivoire outline-none focus:border-cuir-bright"
          />
        </label>
        {error && <p className="text-xs text-cuir-bright">{error}</p>}
        <Button type="submit" disabled={status === "loading"} className="w-full">
          {status === "loading" ? "Connexion…" : "Se connecter"}
        </Button>
      </form>
      <p className="mt-6 text-xs text-brume-soft">
        Le compte se crée depuis le tableau de bord Supabase (Authentication → Users), pas depuis
        cette page — il n'y a pas d'inscription publique.
      </p>
    </div>
  );
}
