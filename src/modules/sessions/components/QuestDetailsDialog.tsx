import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { BookOpen, CheckCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface QuestDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  quest: any;
}

export const QuestDetailsDialog = ({ isOpen, onClose, quest }: QuestDetailsDialogProps) => {
  if (!quest) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-400" />
            Détails de la quête
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Informations détaillées sur la quête sélectionnée
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 overflow-y-auto max-h-[60vh] pr-2">
          <div>
            <h4 className="text-white font-medium text-base mb-3">Titre</h4>
            <p className="text-slate-300 text-base leading-relaxed">{quest.quest?.title || quest.title}</p>
          </div>

          {quest.quest?.description && (
            <div>
              <h4 className="text-white font-medium text-base mb-3">Description</h4>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 max-h-[25vh] overflow-y-auto">
                <ReactMarkdown
                  components={{
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
                      <p className="text-slate-200 leading-relaxed font-light mb-4 last:mb-0">{children}</p>
                    ),
                    h1: ({ children }) => (
                      <h1 className="text-xl font-bold text-slate-100 mb-3 mt-4 first:mt-0">{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-lg font-semibold text-slate-100 mb-2 mt-3 first:mt-0">{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-base font-medium text-slate-100 mb-2 mt-2 first:mt-0">{children}</h3>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside text-slate-200 mb-3 space-y-1">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside text-slate-200 mb-3 space-y-1">{children}</ol>
                    ),
                    li: ({ children }) => <li className="text-slate-200">{children}</li>,
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-slate-600 pl-4 italic text-slate-300 mb-3">
                        {children}
                      </blockquote>
                    ),
                    code: ({ children, className }) => {
                      const isInline = !className;
                      return isInline ? (
                        <code className="bg-slate-700 text-slate-200 px-1 py-0.5 rounded text-sm font-mono">
                          {children}
                        </code>
                      ) : (
                        <code className="block bg-slate-700 text-slate-200 p-3 rounded text-sm font-mono overflow-x-auto">
                          {children}
                        </code>
                      );
                    },
                    pre: ({ children }) => (
                      <pre className="bg-slate-700 text-slate-200 p-3 rounded text-sm font-mono overflow-x-auto mb-3">
                        {children}
                      </pre>
                    ),
                  }}
                >
                  {quest.quest.description}
                </ReactMarkdown>
              </div>
            </div>
          )}

          <div>
            <h4 className="text-white font-medium text-base mb-3">Statut</h4>
            <div className="flex items-center gap-3">
              {quest.quest?.status === "COMPLETED" ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <div className="w-5 h-5 rounded-full bg-blue-400"></div>
              )}
              <span
                className={`text-base font-medium ${
                  quest.quest?.status === "COMPLETED" ? "text-green-300" : "text-blue-300"
                }`}
              >
                {quest.quest?.status === "COMPLETED" ? "Complétée" : "En cours"}
              </span>
            </div>
          </div>

          {quest.quest?.xp && (
            <div>
              <h4 className="text-white font-medium text-base mb-3">Récompense</h4>
              <p className="text-slate-300 text-base">{quest.quest.xp} XP</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
