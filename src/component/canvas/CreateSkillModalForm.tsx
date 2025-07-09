import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { showToast } from "../notification/show-toast";
import { difficulties } from "@/const/skill";

type CreateSkillFormProps = {
  onSuccess: () => void;
};

export const CreateSkillForm = ({ onSuccess }: CreateSkillFormProps) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("EASY");

  const handleSubmit = () => {
    if (!title.trim()) {
      showToast({
        title: "Le titre est requis.",
        status: "error",
        description: "Le titre d'un skill ne peut pas être vide.",
      });
      return;
    }

    // TODO: appel API
    console.log({ title, description, difficulty });
    onSuccess();
  };

  return (
    <>
      <input
        type="text"
        placeholder="Titre"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="bg-white/10 border border-white/20 p-2 rounded w-full mb-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="bg-white/10 border border-white/20 p-2 rounded w-full mb-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <select
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
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
