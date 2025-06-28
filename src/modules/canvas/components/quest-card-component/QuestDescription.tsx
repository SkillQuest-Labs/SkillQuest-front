import { Textarea } from "@/shared/components/ui/textarea";

type DescriptionTextareaProps = {
  description: string;
  onChange?: (value: string) => void;
};

export const QuestDescription = ({
  description,
  onChange,
}: DescriptionTextareaProps) => (
  <div className="bg-gradient-to-r from-yellow-100/5 via-white/10 to-yellow-200/10 rounded-xl p-4 border-2 border-yellow-100/20 shadow-[0_1px_6px_0_rgba(255,255,0,0.08)] relative z-10">
    <div className="flex items-center gap-4 w-full">
      <Textarea
        value={description}
        onChange={(e) => onChange?.(e.target.value)}
        maxLength={200}
        placeholder="Describe your quest... (200 characters)"
        className="min-h-24 max-h-60 w-full text-base font-medium resize-none text-yellow-100 bg-transparent border-2 border-yellow-200/30 rounded-lg px-3 py-2 placeholder:text-yellow-300/60 placeholder:text-lg focus:border-yellow-300 focus:ring-2 focus:ring-yellow-200/30 shadow-[0_1px_4px_0_rgba(255,255,0,0.10)] transition-all"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  </div>
);
