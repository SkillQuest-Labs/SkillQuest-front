import { Button } from "@/shared/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { LEVEL_COLORS } from "../skill-tree.type";

export const SkillTreeLegends = () => {
  const [isLegendCollapsed, setIsLegendCollapsed] = useState(false);

  return (
    <div
      className={`bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white rounded-lg border border-gray-700 shadow-2xl absolute  top-20 left-4 z-10 flex flex-col transition-all duration-500 ease-in-out ${
        isLegendCollapsed ? "w-16 h-16" : "w-80 max-h-[calc(100vh-6rem)]"
      }`}
    >
      <div className="p-4 flex-shrink-0 flex items-center justify-between">
        {!isLegendCollapsed && (
          <div className="flex-1">
            <h2 className="text-xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Légende
            </h2>
            <p className="text-xs text-gray-400 text-center mt-1">Guide de navigation</p>
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsLegendCollapsed(!isLegendCollapsed)}
          className={`bg-slate-700/80 hover:bg-slate-600/80 border-slate-500 text-slate-200 hover:text-white transition-all duration-300 cursor-pointer ${
            isLegendCollapsed ? "w-8 h-8 p-0" : "ml-2"
          }`}
        >
          {isLegendCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>
      </div>

      {/* Collapsible Content */}
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          isLegendCollapsed ? "max-h-0 opacity-0" : "max-h-[calc(100vh-10rem)] opacity-100"
        }`}
      >
        <div className="border-t border-gray-600 mx-4 mb-4"></div>

        {/* Scrollable Content */}
        <div className="px-6 pb-6 overflow-y-auto scrollbar-hide max-h-[calc(100vh-16rem)]">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-blue-300">Types de Nœuds</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <div
                  className="w-8 h-8 mr-3"
                  style={{
                    backgroundColor: LEVEL_COLORS[0].node,
                    border: `2px solid ${LEVEL_COLORS[0].border}`,
                    clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                  }}
                ></div>
                <div>
                  <span className="text-sm font-medium">Keystone 👑</span>
                  <p className="text-xs text-gray-400">Difficulté Hard ou quête principale</p>
                </div>
              </div>
              <div className="flex items-center">
                <div
                  className="w-7 h-7 mr-3 rotate-45"
                  style={{
                    backgroundColor: LEVEL_COLORS[1].node,
                    border: `2px solid ${LEVEL_COLORS[1].border}`,
                  }}
                ></div>
                <div>
                  <span className="text-sm font-medium">Large 💎</span>
                  <p className="text-xs text-gray-400">XP ≥ 200 points</p>
                </div>
              </div>
              <div className="flex items-center">
                <div
                  className="w-6 h-6 mr-3"
                  style={{
                    backgroundColor: LEVEL_COLORS[2].node,
                    border: `2px solid ${LEVEL_COLORS[2].border}`,
                    borderRadius: "4px",
                  }}
                ></div>
                <div>
                  <span className="text-sm font-medium">Medium ✨</span>
                  <p className="text-xs text-gray-400">XP ≥ 100 points</p>
                </div>
              </div>
              <div className="flex items-center">
                <div
                  className="w-5 h-5 rounded-full mr-3"
                  style={{
                    backgroundColor: LEVEL_COLORS[3].node,
                    border: `2px solid ${LEVEL_COLORS[3].border}`,
                  }}
                ></div>
                <div>
                  <span className="text-sm font-medium">Small ⚡</span>
                  <p className="text-xs text-gray-400">XP &lt; 100 points</p>
                </div>
              </div>
              <div className="flex items-center">
                <div
                  className="w-7 h-7 mr-3"
                  style={{
                    backgroundColor: LEVEL_COLORS[4].node,
                    border: `3px solid ${LEVEL_COLORS[4].border}`,
                    borderRadius: "50%",
                  }}
                ></div>
                <div>
                  <span className="text-sm font-medium">Mastery 🏆</span>
                  <p className="text-xs text-gray-400">Compétence maîtrisée</p>
                </div>
              </div>
            </div>
          </div>

          {/* Status Types */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-green-300">États</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <div
                  className="w-5 h-5 rounded-full mr-3"
                  style={{ backgroundColor: "#065f46", border: "2px solid #34d399" }}
                ></div>
                <div>
                  <span className="text-sm font-medium">COMPLETED</span>
                  <p className="text-xs text-gray-400">Quête terminée</p>
                </div>
              </div>
              <div className="flex items-center">
                <div
                  className="w-5 h-5 rounded-full mr-3"
                  style={{ backgroundColor: "#7c2d12", border: "2px solid #fbbf24" }}
                ></div>
                <div>
                  <span className="text-sm font-medium">IN_PROGRESS</span>
                  <p className="text-xs text-gray-400">Quête en cours</p>
                </div>
              </div>
              <div className="flex items-center">
                <div
                  className="w-5 h-5 rounded-full mr-3"
                  style={{ backgroundColor: "#1e3a8a", border: "2px solid #60a5fa" }}
                ></div>
                <div>
                  <span className="text-sm font-medium">NOT_STARTED</span>
                  <p className="text-xs text-gray-400">Quête disponible</p>
                </div>
              </div>
              <div className="flex items-center">
                <div
                  className="w-5 h-5 rounded-full mr-3"
                  style={{ backgroundColor: "#0f172a", border: "2px solid #475569" }}
                ></div>
                <div>
                  <span className="text-sm font-medium">LOCKED</span>
                  <p className="text-xs text-gray-400">Prérequis manquants</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full mr-3 bg-cyan-400 border-2 border-cyan-300"></div>
                <div>
                  <span className="text-sm font-medium">Chemin Actif</span>
                  <p className="text-xs text-gray-400">Dans le parcours sélectionné</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full mr-3 bg-purple-700 border-4 border-amber-400"></div>
                <div>
                  <span className="text-sm font-medium">Sélectionnée</span>
                  <p className="text-xs text-gray-400">Nœud actuellement sélectionné</p>
                </div>
              </div>
            </div>
          </div>

          {/* Rings/Levels */}
          {/* <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-purple-300">Niveaux de Progression</h3>
            <div className="space-y-2 text-xs">
              {Object.entries(LEVEL_COLORS)
                .slice(0, 5)
                .map(([level, colors]) => (
                  <div key={level} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className="w-4 h-4 rounded-full mr-2"
                        style={{ backgroundColor: colors.node, border: `1px solid ${colors.border}` }}
                      ></div>
                      <span>Niveau {level}</span>
                    </div>
                    <div className="w-8 h-0.5" style={{ backgroundColor: colors.connection }}></div>
                  </div>
                ))}
              <div className="text-gray-400 text-center mt-2">...</div>
            </div>
          </div> */}

          {/* Interactions */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-orange-300">Interactions</h3>
            <div className="space-y-2 text-xs text-gray-300">
              <div>• Cliquez pour sélectionner</div>
              <div>• Survolez pour prévisualiser</div>
              <div>• Les connexions montrent les prérequis</div>
              <div>• Les anneaux représentent la progression</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
