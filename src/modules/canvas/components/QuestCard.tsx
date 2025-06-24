import { Gem, Shield, Zap } from "lucide-react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import type { QuestCardProps } from "../canva.type";

export const QuestCard = ({
  data,
  onDelete,
  sourceHandle,
  targetHandle,
}: QuestCardProps) => {
  return (
    <>
      {sourceHandle}
      {targetHandle}
      <svg
        viewBox="0 0 400 600"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        preserveAspectRatio="none"
      >
        <path
          d="M20,0 H380 C390,0 400,10 400,20 V580 C400,590 390,600 380,600 H20 C10,600 0,590 0,580 V20 C0,10 10,0 20,0 Z
                   M40,40 H360 V560 H40 Z"
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="8"
        />
      </svg>

      {/* Badge étoile en haut gauche */}
      <div className="absolute top-4 left-4 z-10">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-500 flex items-center justify-center shadow-[0_2px_12px_2px_rgba(255,215,0,0.25)] border-4 border-yellow-200/80 ring-2 ring-yellow-100/40">
          <Zap className="w-7 h-7 text-yellow-900 drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]" />
        </div>
      </div>

      {/* Bouton X */}
      <div className="absolute top-4 right-4 z-10">
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

      {/* En-tête stylisé */}
      <div className="text-center mt-8 mb-8 relative z-10">
        <h1 className="text-4xl font-extrabold text-yellow-300 drop-shadow-[0_2px_8px_rgba(255,255,0,0.25)] tracking-widest font-serif uppercase">
          QUEST
        </h1>
        <div className="relative mt-1">
          <input
            type="text"
            value={data.title}
            onChange={(e) => data.onUpdate?.("title", e.target.value)}
            placeholder="Quest Title"
            className={cn(
              "text-2xl text-yellow-100 tracking-wide font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)] bg-transparent border-none text-center w-full outline-none focus:ring-0",
              "max-h-24 min-h-10 px-2 py-1",
              "overflow-x-auto overflow-y-auto",
              "break-words",
              "w-[95%]"
            )}
            onClick={(e) => e.stopPropagation()}
            maxLength={120}
            spellCheck={true}
            title={data.title}
          />
        </div>
      </div>

      {/* Section XP */}
      <div className="bg-gradient-to-r from-purple-700/30 via-yellow-100/20 to-purple-900/30 rounded-xl p-4 border-2 border-yellow-300/40 backdrop-blur-md mb-5 shadow-[0_2px_12px_2px_rgba(128,0,255,0.10)] flex items-center gap-4 relative z-10">
        <Gem className="w-7 h-7 text-purple-400 drop-shadow-[0_1px_2px_rgba(128,0,255,0.25)]" />
        <span className="text-yellow-200 font-bold text-2xl tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
          +250 XP
        </span>
      </div>

      {/* Difficulty section */}
      <div className="bg-gradient-to-r from-yellow-200/10 via-white/10 to-yellow-100/5 rounded-xl p-4 border-2 border-yellow-200/20 mb-3 shadow-[0_1px_6px_0_rgba(255,255,0,0.08)] relative z-10">
        <div className="flex items-center gap-4">
          <Shield className="w-10 h-10 text-yellow-300 drop-shadow-[0_1px_2px_rgba(255,255,0,0.15)]" />
          <span className="text-2xl text-yellow-100 font-semibold tracking-wide">
            Difficulty
          </span>
          <Select
            value={data.difficulty}
            onValueChange={(value) => data.onUpdate?.("difficulty", value)}
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

      {/* Section description */}
      <div className="bg-gradient-to-r from-yellow-100/5 via-white/10 to-yellow-200/10 rounded-xl p-4 border-2 border-yellow-100/20 shadow-[0_1px_6px_0_rgba(255,255,0,0.08)] relative z-10">
        <div className="flex items-center gap-4 w-full">
          <Textarea
            value={data.description}
            onChange={(e) => data.onUpdate?.("description", e.target.value)}
            maxLength={200}
            placeholder="Describe your quest... (200 characters)"
            className="min-h-24 max-h-60 w-full text-base font-medium resize-none text-yellow-100 bg-transparent border-2 border-yellow-200/30 rounded-lg px-3 py-2 placeholder:text-yellow-300/60 placeholder:text-lg focus:border-yellow-300 focus:ring-2 focus:ring-yellow-200/30 shadow-[0_1px_4px_0_rgba(255,255,0,0.10)] transition-all"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>
    </>
  );
};
