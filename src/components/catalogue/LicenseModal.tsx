import { AnimatePresence, motion } from "framer-motion";
import type { Pack } from "@/types";
import { useCartStore } from "@/state/cartStore";
import { beats, grooveEase } from "@/lib/tempo";

interface LicenseModalProps {
  pack: Pack;
  open: boolean;
  onClose: () => void;
}

export function LicenseModal({ pack, open, onClose }: LicenseModalProps) {
  const addToCart = useCartStore((s) => s.add);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-noir/80 backdrop-blur-sm sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Licences pour ${pack.title}`}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: beats(0.6), ease: grooveEase }}
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-ivoire/10 bg-noir-soft p-6 sm:rounded-2xl"
          >
            <div className="mb-5 flex items-start justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-cuir-bright">
                  {pack.type} · {pack.bpm} BPM · {pack.key}
                </p>
                <h3 className="mt-1 font-display text-2xl font-semibold text-ivoire">{pack.title}</h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fermer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-ivoire/20 text-ivoire hover:border-cuir-bright"
              >
                ×
              </button>
            </div>

            <ul className="space-y-3">
              {pack.licenses.map((license) => (
                <li
                  key={license.id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-ivoire/10 bg-noir p-4"
                >
                  <div>
                    <p className="font-display text-sm font-semibold uppercase tracking-wide text-ivoire">
                      {license.label}
                    </p>
                    <p className="mt-1 text-xs text-brume-pale/70">{license.description}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <span className="font-display text-lg font-semibold text-ivoire">{license.price}€</span>
                    <button
                      type="button"
                      onClick={() => {
                        addToCart({ packId: pack.id, licenseId: license.id });
                        onClose();
                      }}
                      className="rounded-full bg-cuir px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-ivoire transition-colors hover:bg-cuir-bright"
                    >
                      Ajouter
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
