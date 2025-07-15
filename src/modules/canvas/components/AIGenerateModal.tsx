import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";

type AIGenerateModalProps = {
  open: boolean;
  onGenerate: (context: string) => void;
  onClose: () => void;
};

export const AIGenerateModal = ({ open, onGenerate, onClose }: AIGenerateModalProps) => {
  const [context, setContext] = useState("");
  if (!open) return null;

  const handleSubmit = () => {
    if (!context.trim()) return;
    onGenerate(context);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="backdrop-blur-md bg-white/10 border border-white/20 text-white p-6 rounded-2xl shadow-lg shadow-blue-500/20 w-full max-w-md relative">
        <Button
          variant="ghost"
          onClick={onClose}
          className="absolute top-3 left-3 cursor-pointer text-white hover:text-blue-300 bg-transparent hover:bg-transparent"
        >
          <ChevronLeft />
        </Button>
        <h2 className="text-2xl font-semibold mb-6 text-center">Génération automatique</h2>
        <Textarea
          placeholder="Décris le contexte"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          className="bg-white/10 border border-white/20 p-2 rounded w-full mb-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <Button
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-600 text-white cursor-pointer px-4 py-2 mt-2 rounded-md w-full transition"
        >
          Générer
        </Button>
      </div>
    </div>
  );
};
