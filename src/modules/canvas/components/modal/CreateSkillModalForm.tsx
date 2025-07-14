import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { difficulties } from "@/const/skill";
import { useCreateSkill } from "@/shared/services/skill/api-skill";
import type { QuestDifficulty } from "@/shared/types/quest.type";
import { useSkillStore } from "@/stores/skill/skillStore";
import { showToast } from "@/component/notification/show-toast";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";

type CreateSkillFormProps = {
  onSuccess: () => void;
};

export const CreateSkillForm = ({ onSuccess }: CreateSkillFormProps) => {
  const { setSkill } = useSkillStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<QuestDifficulty>("EASY");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { createSkill } = useCreateSkill();

  const handleSubmit = async () => {
    if (!title.trim()) {
      setErrorMessage("Le titre est requis.");
      return;
    }

    setErrorMessage(null);
    const payload = {
      title,
      description,
      difficulty,
      userId: "uuid-user-1234-5678-9012-345678901234", // Replace dynamically according to your auth
    };

    try {
      const result = await createSkill(payload);
      if (!result.id) {
        showToast({
          title: "Erreur de la creation d'un skill",
          description: "",
          duration: 4000,
          status: "error",
        });
        return;
      }

      setSkill(result);
      onSuccess();
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };

  return (
    <>
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
      <Select value={difficulty} onValueChange={(val) => setDifficulty(val as QuestDifficulty)}>
        <SelectTrigger className="w-full mb-4 bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-blue-400">
          <SelectValue placeholder="Choisir une difficulté" />
        </SelectTrigger>
        <SelectContent className="text-white bg-slate-900 border-white/10">
          {difficulties.map((diff) => (
            <SelectItem key={diff} value={diff} className="capitalize">
              {diff}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        onClick={handleSubmit}
        className="bg-blue-500 hover:bg-blue-600 text-white cursor-pointer px-4 py-2 mt-2 rounded-md w-full transition"
      >
        Valider création
      </Button>
    </>
  );
};
