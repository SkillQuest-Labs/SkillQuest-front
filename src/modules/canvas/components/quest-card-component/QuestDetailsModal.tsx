import { Button } from "@/shared/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Pencil, Save, SaveIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import type { QuestNodeData } from "../../canvas.type";

export type QuestDetailsModalProps = {
  open: boolean;
  quest: QuestNodeData | null;
  onClose: () => void;
};

export const QuestDetailsModal = ({ open, quest, onClose }: QuestDetailsModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (quest) {
      setTitle(quest.title);
      setDescription(quest.description);
    }
  }, [quest]);

  if (!open || !quest) return null;

  const handleSave = () => {
    if (quest.onUpdate) {
      quest.onUpdate("title", title);
      quest.onUpdate("description", description);
    }
    quest.title = title;
    quest.description = description;
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTitle(quest.title);
    setDescription(quest.description);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        style={{ maxWidth: "1000px" }}
        className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50 shadow-2xl rounded-xl grid grid-rows-[auto,1fr,auto] max-h-[100vh] overflow-hidden"
      >
        {/* HEADER */}
        <DialogHeader className="text-left border-b border-slate-700/50 ">
          <label className="text-sm font-medium text-slate-400 uppercase tracking-wider">Titre de la quete</label>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
            {isEditing ? (
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-2xl font-bold bg-transparent border-none p-0 text-center text-slate-100 caret-white
               focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40"
                placeholder="Titre de la quête"
              />
            ) : (
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-center leading-tight">
                {title}
              </DialogTitle>
            )}
          </div>
        </DialogHeader>

        <div className="row-[2] min-h-0 overflow-hidden mt-2">
          {isEditing ? (
            <div className="space-y-2 h-full">
              <label className="text-sm font-medium text-slate-400">Description</label>

              <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 max-h-[60vh] overflow-y-auto">
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description de la quête (Markdown supporté)"
                  className="bg-transparent text-slate-200 border-none outline-none resize-none min-h-[200px] max-h-[56vh] overflow-y-auto"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3 h-full">
              <label className="text-sm font-medium text-slate-400 uppercase tracking-wider">Description</label>

              <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 max-h-[60vh] overflow-y-auto">
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
          )}
        </div>

        <DialogFooter className="row-[3] flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-600">
          {isEditing ? (
            <>
              <Button
                type="button"
                variant="ghost"
                onClick={handleCancel}
                className="w-full sm:w-auto bg-gradient-to-br from-gray-700 via-gray-900 to-gray-800 h-12 cursor-pointer px-6 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-gray-100"
              >
                <X className="h-4 w-4 mr-2" />
                Annuler
              </Button>
              <Button
                type="button"
                variant="default"
                onClick={handleSave}
                className="w-full sm:w-auto bg-gradient-to-br from-green-700 via-green-900 to-gray-800 h-12 cursor-pointer px-6 border-gray-600 text-gray-300 hover:bg-green-800 hover:text-gray-100"
              >
                <Save className="h-4 w-4 mr-2" />
                <span> Sauvegarder </span> <SaveIcon className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="default"
                onClick={onClose}
                className="w-full sm:w-auto bg-gradient-to-br from-red-700 via-red-900 to-gray-800 h-12 cursor-pointer px-6 border-gray-600 text-gray-300 hover:bg-red-800 hover:text-gray-100"
              >
                <span> Fermer </span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsEditing(!isEditing)}
                className="w-full sm:w-auto bg-gradient-to-br from-gray-700 via-gray-900 to-gray-800 h-12 cursor-pointer px-6 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-gray-100"
              >
                <span> Modifier </span> <Pencil className="h-4 w-4" />
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
