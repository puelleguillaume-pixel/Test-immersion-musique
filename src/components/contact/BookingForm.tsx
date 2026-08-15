import { useState, type FormEvent } from "react";
import { sendContactMessage, isContactConfigured } from "@/lib/checkout";
import { Button } from "@/components/ui/Button";

export function BookingForm() {
  const [values, setValues] = useState({ name: "", email: "", subject: "Booking", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    try {
      await sendContactMessage(values);
      setStatus("success");
      setValues({ name: "", email: "", subject: "Booking", message: "" });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-cuir-bright/30 bg-cuir-bright/10 p-8 text-center">
        <p className="font-display text-xl text-ivoire">Message envoyé.</p>
        <p className="mt-2 text-sm text-brume-pale">Réponse sous 48h — merci.</p>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-brume-soft">
            Nom
          </span>
          <input
            required
            value={values.name}
            onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
            className="w-full rounded-lg border border-ivoire/20 bg-noir-soft px-4 py-3 text-sm text-ivoire outline-none focus:border-cuir-bright"
          />
        </label>
        <label className="block">
          <span className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-brume-soft">
            Email
          </span>
          <input
            required
            type="email"
            value={values.email}
            onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
            className="w-full rounded-lg border border-ivoire/20 bg-noir-soft px-4 py-3 text-sm text-ivoire outline-none focus:border-cuir-bright"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-brume-soft">
          Sujet
        </span>
        <select
          value={values.subject}
          onChange={(e) => setValues((v) => ({ ...v, subject: e.target.value }))}
          className="w-full rounded-lg border border-ivoire/20 bg-noir-soft px-4 py-3 text-sm text-ivoire outline-none focus:border-cuir-bright"
        >
          <option>Booking</option>
          <option>Commande de prod sur-mesure</option>
          <option>Presse / média</option>
          <option>Autre</option>
        </select>
      </label>

      <label className="block">
        <span className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-brume-soft">
          Message
        </span>
        <textarea
          required
          rows={5}
          value={values.message}
          onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
          className="w-full rounded-lg border border-ivoire/20 bg-noir-soft px-4 py-3 text-sm text-ivoire outline-none focus:border-cuir-bright"
        />
      </label>

      {!isContactConfigured && (
        <p className="rounded-lg border border-brume/30 bg-brume/10 p-3 text-xs text-brume-pale">
          Le webhook de contact n'est pas encore configuré (VITE_CONTACT_WEBHOOK_URL). Le formulaire
          fonctionnera dès qu'il sera renseigné.
        </p>
      )}
      {error && <p className="text-xs text-cuir-bright">{error}</p>}

      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Envoi…" : "Envoyer"}
      </Button>
    </form>
  );
}
