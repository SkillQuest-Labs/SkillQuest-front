import { Map } from "lucide-react";

type RoadmapButtonProps = {
  onClick: () => void;
};
export const RoadmapButton = ({ onClick }: RoadmapButtonProps) => (
  <div
    className="w-12 h-12 flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-200 rounded-lg shadow-md bg-[rgba(15,10,40,0.90)] border-2 border-[rgba(59,130,246,0.5)] backdrop-blur-md"
    onClick={onClick}
    title="Générer la roadmap"
  >
    <div className="relative flex items-center justify-center w-8 h-8">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400/30 via-purple-500/40 to-pink-500/30 border border-cyan-300/50 shadow-[0_0_12px_rgba(59,130,246,0.4)]" />
      <Map className="relative w-5 h-5 text-orange-400 drop-shadow-[0_2px_4px_rgba(255,165,0,0.35)] z-10" />
      {/* Animated rings */}
      <div className="absolute inset-0 rounded-full border border-cyan-300/30 animate-ping" />
      <div className="absolute inset-[-1px] rounded-full border border-purple-300/20 animate-pulse" />
    </div>
  </div>
);
