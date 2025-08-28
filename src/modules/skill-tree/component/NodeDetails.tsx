import type { CircularSkillNode } from "../skill-tree.type";

export const RenderNodeDetails = ({ selectedNodeData }: { selectedNodeData: CircularSkillNode }) => (
  <div
    key={selectedNodeData.id}
    className="absolute bottom-4 right-4 z-50 bg-black/80 backdrop-blur-sm rounded-lg p-6 border border-cyan-500/30 max-w-sm transition-all duration-300 ease-out transform scale-100 opacity-100"
  >
    <div className="text-white">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center text-2xl">
          {selectedNodeData.icon || "⚡"}
        </div>
        <div>
          <h3 className="font-bold text-lg bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            {selectedNodeData.title}
          </h3>
          <p className="text-xs text-gray-400 uppercase tracking-wider">
            {selectedNodeData.nodeType} • Ring {selectedNodeData.ring}
          </p>
        </div>
      </div>

      <p className="text-sm text-gray-300 mb-4 leading-relaxed">{selectedNodeData.description}</p>

      <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
        <div className="bg-gray-800/50 rounded p-2">
          <div className="text-gray-400">Status</div>
          <div
            className={`font-bold ${
              selectedNodeData.status === "COMPLETED"
                ? "text-green-400"
                : selectedNodeData.isLocked
                  ? "text-red-400"
                  : "text-gray-400"
            }`}
          >
            {selectedNodeData.isLocked ? "Locked" : selectedNodeData.status.replace("-", " ")}
          </div>
        </div>
      </div>

      {/* Les boutons/actions peuvent être ajoutés ici si besoin */}
    </div>
  </div>
);
