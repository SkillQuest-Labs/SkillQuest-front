import { useState } from "react";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";

export type CreateSkillData = {
  title: string;
  description: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
};

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (data: CreateSkillData) => void;
};

export const CreateSkillModal = ({ open, onClose, onCreate }: Props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<CreateSkillData["difficulty"]>("EASY");

  if (!open) return null;

  const handleSubmit = () => {
    onCreate({ title, description, difficulty });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg p-6 w-96 space-y-4">
        <h2 className="text-lg font-bold">Create Skill</h2>
        <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[6rem]"
        />
        <Select value={difficulty} onValueChange={(v) => setDifficulty(v as CreateSkillData["difficulty"])}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="EASY">Easy</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="HARD">Hard</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button onClick={handleSubmit} type="button">
            Create
          </Button>
        </div>
      </div>
    </div>
  );
};
