import { ChevronLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { routes } from "@/routes/router.const";
import type { Skill, SkillDifficulty, SkillStatus } from "@/shared/types/skill.type";

type CreateSkillModalProps = {
  open: boolean;
  onCreate: (skill: Skill) => void;
  onClose: () => void;
};

export const CreateSkillModal = ({ open, onClose, onCreate }: CreateSkillModalProps) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<SkillDifficulty>("EASY");
  const [status, setStatus] = useState<SkillStatus>("DRAFT");

  if (!open) return null;

  const handleSubmit = () => {
    if (!title.trim()) {
      setErrorMessage("Le titre est requis.");
      return;
    }
    onCreate({ title, description, difficulty, status });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="backdrop-blur-md bg-white/10 border border-white/20 text-white p-6 rounded-2xl shadow-lg shadow-blue-500/20 w-full max-w-md relative">
        <Button
          onClick={() => navigate(routes.skills.path)}
          variant="ghost"
          className="absolute top-3 left-3 cursor-pointer text-white hover:text-blue-300 bg-transparent hover:bg-transparent"
        >
          <ChevronLeft />
        </Button>

        <h2 className="text-2xl font-semibold mb-6 text-center">Créer un Skill</h2>

        <Input
          type="text"
          placeholder="Titre"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errorMessage) setErrorMessage(null);
          }}
          className={`bg-white/10 p-2 rounded w-full mb-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 ${
            errorMessage ? "border border-red-500 focus:ring-red-500" : "border border-white/20 focus:ring-blue-400"
          }`}
        />
        {errorMessage && <p className="text-red-400 text-sm mb-2">{errorMessage}</p>}

        <Textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-white/10 border border-white/20 p-2 rounded w-full mb-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <Select value={difficulty} onValueChange={(val) => setDifficulty(val as SkillDifficulty)}>
          <SelectTrigger className="w-full mb-4 bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-blue-400">
            <SelectValue placeholder="Choisir une difficulté" />
          </SelectTrigger>
          <SelectContent className="text-white bg-slate-900 border-white/10">
            <SelectItem value="EASY" className="capitalize">
              Facile
            </SelectItem>
            <SelectItem value="MEDIUM" className="capitalize">
              Moyen
            </SelectItem>
            <SelectItem value="HARD" className="capitalize">
              Difficile
            </SelectItem>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={(val) => setStatus(val as SkillStatus)}>
          <SelectTrigger className="w-full mb-4 bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-blue-400">
            <SelectValue placeholder="Choisir un status" />
          </SelectTrigger>
          <SelectContent className="text-white bg-slate-900 border-white/10">
            <SelectItem value="DRAFT" className="capitalize">
              Brouillon
            </SelectItem>
            <SelectItem value="IN_PROGRESS" className="capitalize">
              En cours
            </SelectItem>
            <SelectItem value="NOT_STARTED" className="capitalize">
              Non commencé
            </SelectItem>
          </SelectContent>
        </Select>
        <Button
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-600 text-white cursor-pointer px-4 py-2 mt-2 rounded-md w-full transition"
        >
          Valider création
        </Button>
      </div>
    </div>
  );
};
