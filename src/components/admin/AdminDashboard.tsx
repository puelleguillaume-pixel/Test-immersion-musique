import { useEffect, useState } from "react";
import { getPacks, deletePack } from "@/data/packs";
import { supabase } from "@/lib/supabase";
import type { Pack } from "@/types";
import { PackAdminRow } from "./PackAdminRow";
import { PackForm } from "./PackForm";
import { Button } from "@/components/ui/Button";

export function AdminDashboard() {
  const [packs, setPacks] = useState<Pack[] | null>(null);
  const [formTarget, setFormTarget] = useState<Pack | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  const reload = () => {
    void getPacks().then(setPacks);
  };

  useEffect(() => {
    reload();
  }, []);

  const handleDelete = async (id: string) => {
    setError(null);
    try {
      await deletePack(id);
      reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Suppression impossible.");
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-cuir-bright">
            Espace artiste
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-ivoire">Catalogue</h1>
        </div>
        <div className="flex gap-3">
          {formTarget === undefined && (
            <Button onClick={() => setFormTarget(null)}>Nouveau pack</Button>
          )}
          <Button variant="outline" onClick={() => void supabase?.auth.signOut()}>
            Déconnexion
          </Button>
        </div>
      </div>

      {error && <p className="mb-4 text-sm text-cuir-bright">{error}</p>}

      {formTarget !== undefined && (
        <div className="mb-8">
          <PackForm
            key={formTarget ? formTarget.id : "new"}
            pack={formTarget}
            onCancel={() => setFormTarget(undefined)}
            onSaved={() => {
              setFormTarget(undefined);
              reload();
            }}
          />
        </div>
      )}

      {!packs ? (
        <p className="text-sm text-brume-pale/70">Chargement…</p>
      ) : packs.length === 0 ? (
        <p className="text-sm text-brume-pale/70">Aucun pack pour l'instant.</p>
      ) : (
        <div className="space-y-3">
          {packs.map((pack) => (
            <PackAdminRow
              key={pack.id}
              pack={pack}
              onEdit={() => setFormTarget(pack)}
              onDelete={() => handleDelete(pack.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
