import { useState } from "react";
import type { Pack } from "@/types";
import { PACK_TYPE_LABEL } from "@/lib/catalogue";

interface PackAdminRowProps {
  pack: Pack;
  onEdit: () => void;
  onDelete: () => Promise<void>;
}

export function PackAdminRow({ pack, onEdit, onDelete }: PackAdminRowProps) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete();
    setDeleting(false);
    setConfirming(false);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-ivoire/10 bg-noir p-4">
      <div className="flex items-center gap-4">
        <div
          className="h-12 w-12 shrink-0 rounded-lg"
          style={{ background: `linear-gradient(150deg, ${pack.coverGradient[0]}, ${pack.coverGradient[1]})` }}
        />
        <div>
          <p className="font-display text-sm font-semibold text-ivoire">{pack.title}</p>
          <p className="font-mono text-xs uppercase tracking-wide text-brume-soft">
            {PACK_TYPE_LABEL[pack.type]} · {pack.bpm} BPM · {pack.key} · dès {pack.licenses[0]?.price ?? 0}€
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {!pack.audioUrl && (
          <span className="rounded-full border border-brume/30 px-2.5 py-1 text-[10px] uppercase tracking-wide text-brume-pale">
            Sans audio
          </span>
        )}
        <button
          type="button"
          onClick={onEdit}
          className="rounded-full border border-ivoire/20 px-4 py-1.5 text-xs uppercase tracking-wide text-ivoire hover:border-cuir-bright"
        >
          Modifier
        </button>
        {confirming ? (
          <button
            type="button"
            onClick={() => void handleDelete()}
            disabled={deleting}
            className="rounded-full bg-cuir px-4 py-1.5 text-xs uppercase tracking-wide text-ivoire hover:bg-cuir-bright"
          >
            {deleting ? "…" : "Confirmer"}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="rounded-full border border-ivoire/20 px-4 py-1.5 text-xs uppercase tracking-wide text-brume-pale hover:border-cuir-bright hover:text-cuir-bright"
          >
            Supprimer
          </button>
        )}
      </div>
    </div>
  );
}
