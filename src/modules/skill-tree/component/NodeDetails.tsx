import clsx from "clsx";
import type { CircularSkillNode } from "../skill-tree.type";

type RenderNodeDetailsProps = {
  selectedNodeData: CircularSkillNode;
  minimalistView?: boolean;
};

export const RenderNodeDetails = ({ selectedNodeData, minimalistView }: RenderNodeDetailsProps) => (
  <div
    key={selectedNodeData.id}
    className={clsx(
      "absolute bottom-6 right-8 z-50 bg-gradient-to-br from-black/90 via-blue-950/90 to-cyan-900/90 shadow-2xl backdrop-blur-lg rounded-xl p-5 border border-cyan-400/40 max-w-sm transition-all duration-300 ease-out scale-100 opacity-100 animate-fade-in",
      !minimalistView && "bottom-16",
    )}
  >
    <div className="text-white">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center text-2xl shadow-lg border-2 border-cyan-300/40 animate-pop">
          {selectedNodeData.icon || "⚡"}
        </div>
        <div>
          <h3 className="font-extrabold text-xm bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-md">
            {selectedNodeData.title}
          </h3>
          <p className="text-xs text-cyan-300 uppercase tracking-widest font-semibold mt-1">
            {selectedNodeData.nodeType} • Ring {selectedNodeData.ring}
          </p>
        </div>
      </div>

      <p className="text-sm text-cyan-100 mb-4 leading-relaxed font-medium border-l-4 border-cyan-400/40 pl-3 bg-cyan-900/20">
        {selectedNodeData.description}
      </p>

      <div className="grid grid-cols-2 gap-3 mb-2 text-xs">
        <div className="bg-gradient-to-br from-blue-900/60 to-cyan-900/60 rounded-md p-2 border border-cyan-400/20 shadow-inner">
          <div className="text-cyan-300 font-semibold mb-1">Status</div>
          <div
            className={`font-bold text-base ${
              selectedNodeData.status === "COMPLETED"
                ? "text-green-400"
                : selectedNodeData.isLocked
                  ? "text-red-400"
                  : "text-yellow-300"
            }`}
          >
            {selectedNodeData.isLocked ? "Locked" : selectedNodeData.status.replace("-", " ")}
          </div>
        </div>
      </div>
    </div>

    <div className="absolute -inset-1 rounded-xl pointer-events-none border-2 border-cyan-400/20 blur-lg opacity-60 animate-glow" />
    <style>
      {`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-12px) scale(0.97);}
          to { opacity: 1; transform: translateY(0) scale(1);}
        }
        .animate-fade-in { animation: fade-in 0.7s cubic-bezier(.4,0,.2,1) both; }
        @keyframes pop {
          0% { transform: scale(0.85);}
          80% { transform: scale(1.06);}
          100% { transform: scale(1);}
        }
        .animate-pop { animation: pop 0.5s cubic-bezier(.4,0,.2,1) both;}
        @keyframes glow {
          0%,100% { box-shadow: 0 0 18px 6px #22d3ee44, 0 0 0 0 #3b82f644;}
          50% { box-shadow: 0 0 36px 12px #22d3ee88, 0 0 0 0 #3b82f688;}
        }
        .animate-glow { animation: glow 2.5s ease-in-out infinite;}
      `}
    </style>
  </div>
);
