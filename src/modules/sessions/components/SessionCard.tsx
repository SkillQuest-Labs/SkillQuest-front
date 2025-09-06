import { ConfirmDeleteDialogue } from "@/component/confirm-dialogue/ConfirmDeleteDialogue";
import { showToast } from "@/component/notification/show-toast";
import { Button } from "@/shared/components/ui/button";
import { useDeleteSession } from "@/shared/services/session/api-session";
import type { Session } from "@/shared/services/session/api-session.type";
import { Check, Play, Trash2 } from "lucide-react";
import { useState } from "react";

const getDateToTime = (iso: string) => {
  const d = new Date(iso);
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
};

type SessionCardProps = { session: Session };

export const SessionCard = ({ session }: SessionCardProps) => {
  const { deleteSession } = useDeleteSession(session.id);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handlePlay = () => {};
  const handleValidate = () => {};
  const handleDelete = async () => {
    try {
      await deleteSession();
      showToast({
        title: "Succès",
        description: "La session a été supprimée avec succès",
        status: "success",
      });
    } catch {
      showToast({
        title: "Erreur",
        description: "Erreur lors de la suppression de la session",
        status: "error",
      });
    }
  };

  return (
    <>
      {/* Carte en colonne: header → infos → footer */}
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span
              aria-label="Couleur"
              className="session-dot"
              style={{ backgroundColor: session.color }}
              title={session.color}
            />
            <h3 className="truncate font-semibold text-slate-100 leading-tight">{session.linkedSkill.title}</h3>
          </div>

          {/* Date compacte à droite */}
          <span className="rounded-full bg-slate-800/60 px-3 py-1 text-xs text-slate-300">
            {session.date.slice(0, 10)}
          </span>
        </div>

        {/* Infos */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
          <div className="rounded-full bg-slate-800/60 px-3 py-1">
            <span className="text-slate-400">Heure :</span>{" "}
            <span className="font-medium text-slate-100">
              {getDateToTime(session.startTime)} – {getDateToTime(session.endTime)}
            </span>
          </div>
          <div className="rounded-full bg-slate-800/60 px-3 py-1">
            <span className="text-slate-400">Durée :</span>{" "}
            <span className="font-medium text-slate-100">{session.duration} minutes</span>
          </div>
        </div>

        {/* Footer actions (barre propre en bas) */}
        <div className="mt-5 grid grid-cols-3 overflow-hidden rounded-lg border border-slate-700/60">
          <Button
            onClick={handlePlay}
            aria-label="Démarrer la session"
            className="btn-action btn-play h-full w-full rounded-none bg-transparent text-slate-200 hover:text-white"
          >
            <Play className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline">Play</span>
          </Button>
          <Button
            onClick={handleValidate}
            aria-label="Valider la session"
            className="btn-action btn-validate h-full w-full rounded-none bg-transparent text-slate-200 hover:text-white"
          >
            <Check className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline">Valider</span>
          </Button>
          <Button
            onClick={() => setIsDeleteDialogOpen(true)}
            aria-label="Supprimer la session"
            className="btn-action btn-delete h-full w-full rounded-none bg-transparent text-slate-200 hover:text-white"
          >
            <Trash2 className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline">Supprimer</span>
          </Button>
        </div>
      </div>

      <ConfirmDeleteDialogue
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        messageDialogue="Êtes-vous sûr de vouloir supprimer la session ? Cette action est irréversible."
        handleConfirmDelete={handleDelete}
      />
    </>
  );
};
