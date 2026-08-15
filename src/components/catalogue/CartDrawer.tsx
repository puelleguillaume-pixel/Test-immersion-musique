import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCartStore } from "@/state/cartStore";
import { getPacks } from "@/data/packs";
import type { Pack } from "@/types";
import { createCheckoutSession, isCheckoutConfigured } from "@/lib/checkout";
import { beats, grooveEase } from "@/lib/tempo";
import { Button } from "@/components/ui/Button";

export function CartDrawer() {
  const { items, isOpen, close, remove, clear } = useCartStore();
  const [packs, setPacks] = useState<Pack[]>([]);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && packs.length === 0) {
      void getPacks().then(setPacks);
    }
  }, [isOpen, packs.length]);

  const resolved = useMemo(() => {
    return items
      .map((item) => {
        const pack = packs.find((p) => p.id === item.packId);
        const license = pack?.licenses.find((l) => l.id === item.licenseId);
        if (!pack || !license) return null;
        return { pack, license, item };
      })
      .filter((v): v is { pack: Pack; license: Pack["licenses"][number]; item: (typeof items)[number] } => v !== null);
  }, [items, packs]);

  const total = resolved.reduce((sum, r) => sum + r.license.price, 0);

  useEffect(() => {
    if (!isOpen) {
      setStatus("idle");
      setError(null);
    }
  }, [isOpen]);

  const handleCheckout = async () => {
    if (!email) {
      setError("Renseigne une adresse email pour recevoir tes fichiers.");
      return;
    }
    setStatus("loading");
    setError(null);
    try {
      const { url } = await createCheckoutSession({
        email,
        items: resolved.map((r) => ({
          packTitle: r.pack.title,
          licenseLabel: r.license.label,
          price: r.license.price,
          packId: r.pack.id,
          licenseId: r.license.id,
        })),
        total,
      });
      clear();
      window.location.href = url;
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Une erreur est survenue.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[55] bg-noir/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.aside
            role="dialog"
            aria-label="Panier"
            aria-modal="true"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: beats(0.8), ease: grooveEase }}
            className="fixed right-0 top-0 z-[56] flex h-full w-full max-w-md flex-col border-l border-ivoire/10 bg-noir-soft"
          >
            <div className="flex items-center justify-between border-b border-ivoire/10 p-6">
              <h2 className="font-display text-lg uppercase tracking-wide text-ivoire">
                Panier ({resolved.length})
              </h2>
              <button
                type="button"
                onClick={close}
                aria-label="Fermer le panier"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-ivoire/20 text-ivoire hover:border-cuir-bright"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {resolved.length === 0 ? (
                <p className="text-sm text-brume-pale/70">
                  Ton panier est vide. Direction le catalogue pour trouver ta prod.
                </p>
              ) : (
                <ul className="space-y-4">
                  {resolved.map(({ pack, license }) => (
                    <li
                      key={`${pack.id}-${license.id}`}
                      className="flex items-center justify-between gap-3 rounded-xl border border-ivoire/10 p-4"
                    >
                      <div>
                        <p className="font-display text-sm font-semibold text-ivoire">{pack.title}</p>
                        <p className="text-xs uppercase tracking-wide text-brume-pale">{license.label}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-display text-sm text-ivoire">{license.price}€</span>
                        <button
                          type="button"
                          onClick={() => remove(pack.id, license.id)}
                          aria-label={`Retirer ${pack.title}`}
                          className="text-xs text-brume-soft hover:text-cuir-bright"
                        >
                          Retirer
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {resolved.length > 0 && (
              <div className="space-y-4 border-t border-ivoire/10 p-6">
                <div className="flex items-center justify-between font-display text-lg text-ivoire">
                  <span>Total</span>
                  <span>{total}€</span>
                </div>

                <input
                  type="email"
                  required
                  placeholder="ton@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-full border border-ivoire/20 bg-noir px-4 py-2.5 text-sm text-ivoire outline-none placeholder:text-brume-soft focus:border-cuir-bright"
                />

                {!isCheckoutConfigured && (
                  <p className="rounded-lg border border-brume/30 bg-brume/10 p-3 text-xs text-brume-pale">
                    Paiement en cours de configuration — le webhook de checkout n'est pas encore
                    branché (VITE_CHECKOUT_WEBHOOK_URL).
                  </p>
                )}
                {error && <p className="text-xs text-cuir-bright">{error}</p>}

                <Button
                  className="w-full"
                  disabled={status === "loading"}
                  onClick={() => void handleCheckout()}
                >
                  {status === "loading" ? "Redirection…" : "Passer commande"}
                </Button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
