import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import type { QuestNodeData } from "../../canvas.type";
import { Button } from "@/shared/components/ui/button";
import ReactMarkdown from "react-markdown";

export type QuestDetailsModalProps = {
  open: boolean;
  quest: QuestNodeData | null;
  onClose: () => void;
};

export const QuestDetailsModal = ({ open, quest, onClose }: QuestDetailsModalProps) => {
  if (!open || !quest) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        style={{ maxWidth: "1000px" }}
        className="w-[900px] max-h-[95vh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50 shadow-2xl rounded-xl"
      >
        <DialogHeader className="text-left border-b border-slate-700/50">
          <label className="text-sm font-medium text-slate-400 uppercase tracking-wider">Titre de la quete</label>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-center leading-tight">
              {quest.title}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="mt-6 space-y-4">
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-400 uppercase tracking-wider">Description</label>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 max-h-[400px] overflow-y-auto scrollbar-hide">
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
                    <p className="text-lg text-slate-200 leading-relaxed font-light mb-4 last:mb-0">{children}</p>
                  ),
                  h1: ({ children }) => (
                    <h1 className="text-2xl font-bold text-slate-100 mb-4 mt-6 first:mt-0">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-xl font-semibold text-slate-100 mb-3 mt-5 first:mt-0">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-lg font-medium text-slate-100 mb-2 mt-4 first:mt-0">{children}</h3>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside text-slate-200 mb-4 space-y-1">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside text-slate-200 mb-4 space-y-1">{children}</ol>
                  ),
                  li: ({ children }) => <li className="text-slate-200">{children}</li>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-slate-600 pl-4 italic text-slate-300 mb-4">
                      {children}
                    </blockquote>
                  ),
                  code: ({ children, className }) => {
                    const isInline = !className;
                    if (isInline) {
                      return (
                        <code className="bg-slate-700 text-slate-200 px-1 py-0.5 rounded text-sm font-mono">
                          {children}
                        </code>
                      );
                    }
                    return (
                      <pre className="bg-slate-700 text-slate-200 p-4 rounded-lg overflow-x-auto mb-4">
                        <code className="text-sm font-mono">{children}</code>
                      </pre>
                    );
                  },
                }}
              >
                {quest.description}
              </ReactMarkdown>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-600">
          <Button
            type="button"
            variant="default"
            onClick={onClose}
            className="w-full sm:w-auto bg-gradient-to-br from-red-700 via-red-900 to-gray-800 h-12 cursor-pointer px-6 border-gray-600 text-gray-300 hover:bg-red-800 hover:text-gray-100"
          >
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
