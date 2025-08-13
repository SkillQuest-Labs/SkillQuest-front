import { X } from "lucide-react";

type DeleteButtonProps = {
  onDelete: () => void;
};

export const DeleteButton = ({ onDelete }: DeleteButtonProps) => (
  <div className="absolute top-0 right-4 z-10">
    <div
      className="w-11 h-11 rounded-full bg-gradient-to-br from-red-500 via-red-400 to-pink-500 flex items-center justify-center shadow-lg cursor-pointer border-2 border-white/40 hover:scale-105 transition-transform"
      onClick={(e) => {
        e.stopPropagation();
        onDelete();
      }}
    >
      <X className="w-5 h-5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]" />
    </div>
  </div>
);
