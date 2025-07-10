import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { difficulties } from "@/const/skill";
import { useCreateSkill } from "@/shared/services/skill/api-skill";
import type { QuestDifficulty } from "@/shared/types/quest.type";
import { useSkillStore } from "@/stores/skill/skillStore";
import { showToast } from "@/component/notification/show-toast";

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
      userId: "f3f50bc5-bbbd-4f68-82b3-55a2428c16a3", // Remplace dynamiquement selon ton auth
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
      <input
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

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="bg-white/10 border border-white/20 p-2 rounded w-full mb-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <select
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value as QuestDifficulty)}
        className="bg-white/10 border border-white/20 p-2 rounded w-full mb-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        {difficulties.map((diff) => (
          <option key={diff} value={diff} className="text-black">
            {diff}
          </option>
        ))}
      </select>
      <Button
        onClick={handleSubmit}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 mt-2 rounded-md w-full transition"
      >
        Valider création
      </Button>
    </>
  );
};
