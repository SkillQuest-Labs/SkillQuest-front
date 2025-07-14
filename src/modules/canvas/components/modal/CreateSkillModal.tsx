import { ChevronLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { CreateSkillForm } from "./CreateSkillModalForm";

type CreateSkillModalProps = {
  onClose: () => void;
  onBack: () => void;
};

export const CreateSkillModal = ({ onClose, onBack }: CreateSkillModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="backdrop-blur-md bg-white/10 border border-white/20 text-white p-6 rounded-2xl shadow-lg shadow-blue-500/20 w-full max-w-md relative">
        <Button
          onClick={onBack}
          variant="ghost"
          className="absolute top-3 left-3 text-white hover:text-blue-300 bg-transparent hover:bg-transparent"
        >
          <ChevronLeft />
        </Button>

        <h2 className="text-2xl font-semibold mb-6 text-center">Créer un Skill</h2>

        <CreateSkillForm onSuccess={onClose} />
      </div>
    </div>
  );
};
