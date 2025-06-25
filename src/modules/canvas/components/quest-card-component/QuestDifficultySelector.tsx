import { Shield } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import type { QuestDifficulty } from "../../canva.type";

type DifficultySelectorProps = {
  value: QuestDifficulty;
  onChange?: (value: QuestDifficulty) => void;
};

export const QuestDifficultySelector = ({
  value,
  onChange,
}: DifficultySelectorProps) => (
  <div className="bg-gradient-to-r from-yellow-200/10 via-white/10 to-yellow-100/5 rounded-xl p-4 border-2 border-yellow-200/20 mb-3 shadow-[0_1px_6px_0_rgba(255,255,0,0.08)] relative z-10">
    <div className="flex items-center gap-4">
      <Shield className="w-10 h-10 text-yellow-300 drop-shadow-[0_1px_2px_rgba(255,255,0,0.15)]" />
      <span className="text-2xl text-yellow-100 font-semibold tracking-wide">
        Difficulty
      </span>
      <Select
        value={value}
        onValueChange={(val) => onChange?.(val as QuestDifficulty)}
      >
        <SelectTrigger
          className="w-28 h-8 text-xl font-bold border-2 border-yellow-300/60 bg-yellow-100/10 rounded-lg shadow-[0_1px_4px_0_rgba(255,255,0,0.10)] text-yellow-200 hover:bg-yellow-200/10 focus:ring-2 focus:ring-yellow-300/40 transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-2 text-yellow-200 font-bold">
            <SelectValue />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-[#232946] border-yellow-200/40 text-yellow-100 font-semibold">
          <SelectItem value="Easy" className="hover:bg-yellow-200/10">
            Easy
          </SelectItem>
          <SelectItem value="Medium" className="hover:bg-yellow-200/10">
            Medium
          </SelectItem>
          <SelectItem value="Hard" className="hover:bg-yellow-200/10">
            Hard
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
);
