import { Button } from "@/shared/components/ui/button";
import type { SessionFormType } from "../types/session-form.type";

interface ColorPickerProps {
  currentSession: SessionFormType;
  setForm: (form: SessionFormType) => void;
  disabled?: boolean;
}

const colors = ["#3B82F6", "#A78BFA", "#F472B6", "#34D399", "#F59E0B"];

export const ColorPicker = ({ currentSession, setForm, disabled = false }: ColorPickerProps) => {
  const handleColorSelect = (color: string) => {
    setForm({ ...currentSession, color });
  };

  return (
    <div className="mb-4">
      <label className="text-sm text-white mb-1 block">Étiquette</label>
      <div className="flex space-x-2">
        {colors.map((color) => (
          <Button
            key={color}
            type="button"
            className={`w-6 h-6 rounded-full border-2 ${currentSession.color === color ? "border-white" : "border-transparent"} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            style={{ backgroundColor: color }}
            onClick={() => handleColorSelect(color)}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
};
