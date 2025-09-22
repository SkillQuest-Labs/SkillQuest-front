import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import clsx from "clsx";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import type { CircularSkillNode } from "../skill-tree.type";

type RenderNodeDetailsProps = {
  selectedNodeData: CircularSkillNode;
  minimalistView?: boolean;
};

type MetaEntry = {
  label: string;
  value: string;
};

const formatLabel = (value?: string | null) => {
  if (!value) return undefined;
  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/(^|\s)\w/g, (match) => match.toUpperCase());
};

const markdownComponents: Components = {
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-400 hover:text-blue-300 underline transition-colors"
    >
      {children}
    </a>
  ),
  p: ({ children }) => (
    <p className="mb-4 break-words text-base leading-relaxed text-slate-200 last:mb-0">{children}</p>
  ),
  h2: ({ children }) => <h2 className="mb-3 mt-6 text-xl font-semibold text-slate-100 first:mt-0">{children}</h2>,
  h3: ({ children }) => <h3 className="mb-2 mt-5 text-lg font-semibold text-slate-100 first:mt-0">{children}</h3>,
  ul: ({ children }) => <ul className="mb-4 list-disc space-y-1 pl-5 text-slate-200">{children}</ul>,
  ol: ({ children }) => <ol className="mb-4 list-decimal space-y-1 pl-5 text-slate-200">{children}</ol>,
  li: ({ children }) => <li className="break-words text-slate-200">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="mb-4 border-l-4 border-slate-700 pl-4 italic text-slate-300">{children}</blockquote>
  ),
  code: ({ children }) => <code className="rounded bg-slate-800 px-1.5 py-0.5 text-sm text-slate-100">{children}</code>,
};

export const RenderNodeDetails = ({ selectedNodeData, minimalistView }: RenderNodeDetailsProps) => {
  const questDetails = selectedNodeData.questDetails;
  const statusLabel = selectedNodeData.isLocked
    ? "Verrouillé"
    : (formatLabel(String(selectedNodeData.status)) ?? "Inconnu");

  const badges = [
    questDetails?.number ? `Quête ${questDetails.number}` : null,
    questDetails?.type ? formatLabel(questDetails.type) : null,
  ].filter(Boolean) as string[];

  const meta: MetaEntry[] = [
    { label: "Statut", value: statusLabel },
    // { label: "Type", value: formatLabel(selectedNodeData.nodeType) ?? "Standard" },
    { label: "Anneau", value: `Niveau ${selectedNodeData.ring}` },
    {
      label: "Pré-requis",
      value: selectedNodeData.prerequisites.length ? `${selectedNodeData.prerequisites.length}` : "Aucun",
    },
  ];

  if (selectedNodeData.connections.length) {
    meta.push({ label: "Connexions", value: `${selectedNodeData.connections.length}` });
  }

  if (questDetails?.isStarting) {
    meta.push({ label: "Point de départ", value: "Oui" });
  }

  const [isQuestModalOpen, setIsQuestModalOpen] = useState(false);

  const description = selectedNodeData.description?.trim();

  const preview = useMemo(() => {
    if (!description) {
      return "";
    }

    const normalized = description.replace(/\s+/g, " ").trim();
    if (normalized.length <= 220) {
      return normalized;
    }

    return `${normalized.slice(0, 200).trimEnd()}…`;
  }, [description]);

  return (
    <>
      <aside
        key={selectedNodeData.id}
        className={clsx(
          "absolute inset-x-4 bottom-4 z-50 w-auto max-w-md rounded-2xl border border-slate-800/70 bg-slate-950/90 px-6 py-5 text-slate-50 shadow-[0_25px_70px_-20px_rgba(2,6,23,0.9)] backdrop-blur-xl transition-all duration-300 animate-in fade-in-0 slide-in-from-right-4 sm:inset-auto sm:right-6 sm:w-80 md:right-10",
          !minimalistView && "md:bottom-24",
        )}
      >
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-2xl">
            {selectedNodeData.icon || "🧭"}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-100">{selectedNodeData.title}</h3>
            <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-400">
              {badges.length ? (
                badges.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full border border-slate-700/80 bg-slate-900/70 px-2.5 py-1 font-medium"
                  >
                    {badge}
                  </span>
                ))
              ) : (
                <span className="rounded-full border border-slate-800/60 bg-slate-900/70 px-2.5 py-1 font-medium">
                  {formatLabel(selectedNodeData.nodeType) ?? "Nœud"}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-slate-800/60 bg-slate-900/60 p-4">
          {description ? (
            <>
              <p className="line-clamp-4 break-words text-sm leading-relaxed text-slate-300">{preview}</p>
              <div className="mt-4 flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsQuestModalOpen(true)}
                  className="cursor-pointer rounded-full border border-slate-700 bg-slate-800/60 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200 transition hover:text-white hover:border-slate-600 hover:bg-slate-800"
                >
                  Voir les détails de la quête
                </Button>
              </div>
            </>
          ) : (
            <p className="text-sm leading-relaxed text-slate-400">
              Aucune description disponible pour ce nœud pour le moment.
            </p>
          )}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-slate-200">
          {meta.map((item) => (
            <div
              key={`${item.label}-${item.value}`}
              className="rounded-lg border border-slate-800/60 bg-slate-900/60 p-3"
            >
              <span className="block text-xs font-medium uppercase tracking-wide text-slate-500">{item.label}</span>
              <span className="mt-1 block text-sm font-semibold text-slate-100">{item.value}</span>
            </div>
          ))}
        </div>
      </aside>

      {description && (
        <Dialog open={isQuestModalOpen} onOpenChange={setIsQuestModalOpen}>
          <DialogContent className="max-w-3xl border-slate-800/70 bg-slate-950/95 text-slate-100">
            <DialogHeader className="text-left">
              <DialogTitle className="text-2xl font-semibold text-slate-100">{selectedNodeData.title}</DialogTitle>
              <DialogDescription className="text-slate-400">Détails complets de la quête</DialogDescription>
            </DialogHeader>

            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-400">
              {badges.map((badge) => (
                <span
                  key={`modal-${badge}`}
                  className="rounded-full border border-slate-700/80 bg-slate-900/70 px-3 py-1 font-medium"
                >
                  {badge}
                </span>
              ))}
              {questDetails?.isStarting && !badges.includes("Point de départ") && (
                <span className="rounded-full border border-emerald-700/60 bg-emerald-900/40 px-3 py-1 font-medium text-emerald-200">
                  Point de départ
                </span>
              )}
            </div>

            <div className="mt-6 max-h-[60vh] overflow-y-auto rounded-2xl border border-slate-800/60 bg-slate-900/60 p-6">
              <div className="break-words">
                <ReactMarkdown components={markdownComponents}>{description}</ReactMarkdown>
              </div>
            </div>

            <DialogFooter className="mt-6 justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsQuestModalOpen(false)}
                className="cursor-pointer rounded-full border border-slate-700 bg-slate-800/60 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
              >
                Fermer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
