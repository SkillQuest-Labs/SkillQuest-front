import { SkillTreeLoader } from "@/component/SkillTreeLoader";
import type { QuestNodeData, SkillNodeData } from "@/modules/canvas/canvas.type";
import { Button } from "@/shared/components/ui/button";
import type { Edge, Node } from "@xyflow/react";
import { ChevronDown, ChevronLeft, ChevronRight, PauseIcon, PlayIcon } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { generateCircularSkillTreeData } from "../circular-skill-tree-logic/generate-circular-skill-tree-logic";
import type { DependencyGraph } from "../circular-skill-tree-logic/generate-circular-skill-tree-logic/dependency-graph";
import { LEVEL_COLORS } from "../render-node/render-node";
import type { CircularSkillNode } from "../skill-tree.type";
import { RenderConcentricCircles } from "./concentric-circles/RenderConcentricCircles";
import { RenderNodeDetails } from "./NodeDetails";
import { NodeRenderer } from "./render-node-component/NodeRenderer";
import { ConnectionsRenderer } from "./render-node-connections/ConnectionsRenderer";

export type SkillTreeDataProps = {
  nodes: CircularSkillNode[];
  graph: DependencyGraph;
};

export type SkillTreeProps = {
  nodes: Node<QuestNodeData | SkillNodeData>[];
  edges: Edge[];
  onBack?: () => void;
};

export const SkillTree = ({ nodes, edges, onBack }: SkillTreeProps) => {
  const [animationEnabled, setAnimationEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [circularSkillNodes, setCircularSkillNodes] = useState<CircularSkillNode[]>([]);
  const [dependencyGraph, setDependencyGraph] = useState<DependencyGraph>();

  const skilTreecanvasRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);

  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [activeNodePath, setActiveNodePath] = useState<string[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [highlightedPathNodes, setHighlightedPathNodes] = useState<string[]>([]);
  const [isLegendCollapsed, setIsLegendCollapsed] = useState(false);

  // Dynamically measure container size and compute center
  const [containerSize, setContainerSize] = useState({ width: 1000, height: 800 });

  useLayoutEffect(() => {
    if (skilTreecanvasRef.current) {
      const rect = skilTreecanvasRef.current.getBoundingClientRect();
      setContainerSize({ width: rect.width, height: rect.height });
    }
  }, []);

  const centerX = containerSize.width / 2;
  const centerY = containerSize.height / 2;

  useEffect(() => {
    const generateNodes = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));
      const { graph, circularSkillNodes } = generateCircularSkillTreeData({ nodes, edges, centerX, centerY });
      console.log("circularSkillNodes", circularSkillNodes);
      setCircularSkillNodes(circularSkillNodes);
      setDependencyGraph(graph);
      setIsLoading(false);
    };

    if (centerX > 0 && centerY > 0) {
      generateNodes();
    }
  }, [nodes, edges, centerX, centerY]);

  const handleNodeClick = useCallback(
    (e: React.MouseEvent, nodeId: string) => {
      e.stopPropagation();
      setIsPanning(false); // Stop panning when clicking on a node

      const node = circularSkillNodes.find((n) => n.id === nodeId);
      if (!node) return;

      setSelectedNode(nodeId);

      // Calculate and set highlighted path
      if (dependencyGraph) {
        setHighlightedPathNodes(dependencyGraph.getConnectedPath(nodeId));
      }

      if (node.status === "NOT_STARTED" && !node.isLocked) {
        // Update active path
        setActiveNodePath((prev) => [...prev, nodeId]);
      }
    },
    [circularSkillNodes, dependencyGraph],
  );

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.95 : 1.05;
    setZoom((prev) => Math.max(0.5, Math.min(3, prev * delta)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Allow panning everywhere except when clicking directly on nodes
    setIsPanning(true);
    setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const renderNode = useCallback(
    (node: CircularSkillNode) => {
      return NodeRenderer({
        node,
        activeNodePath,
        hoveredNode,
        selectedNode,
        highlightedPathNodes,
        handleNodeClick,
        setHoveredNode,
      });
    },
    [activeNodePath, hoveredNode, selectedNode, highlightedPathNodes, handleNodeClick],
  );

  const handleSkillTreeCanvasClick = () => {
    setSelectedNode(null);
    setHighlightedPathNodes([]);
    setActiveNodePath([]);
  };

  const selectedNodeData = circularSkillNodes.find((n) => n.id === selectedNode);

  return (
    <div className="w-full h-screen relative overflow-hidden relative  flex items-center justify-center bg-slate-900">
      {onBack && (
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="absolute cursor-pointer top-4 left-4 z-10 bg-slate-700/80 backdrop-blur-sm border-slate-500 hover:bg-slate-600/80 text-slate-200 hover:text-white transition-all duration-200 font-medium shadow-lg flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Button>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => setAnimationEnabled(!animationEnabled)}
        className="absolute cursor-pointer top-4 right-4 z-10 bg-slate-700/80 backdrop-blur-sm border-slate-500 hover:bg-slate-600/80 text-slate-200 hover:text-white transition-all duration-200 font-medium shadow-lg"
      >
        {animationEnabled ? (
          <>
            <PauseIcon className="inline-block w-4 h-4 mr-1" /> Pause
          </>
        ) : (
          <>
            <PlayIcon className="inline-block w-4 h-4 mr-1" /> Play
          </>
        )}
      </Button>

      <div
        ref={skilTreecanvasRef}
        className="w-full h-[400px] cursor-grab active:cursor-grabbing"
        onClick={handleSkillTreeCanvasClick}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {isLoading ? (
          <SkillTreeLoader
            title="Génération de l'arbre de compétences"
            description="Calcul des positions et des connexions..."
          />
        ) : (
          <div
            className="w-full h-full animate-in fade-in-0 duration-700"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: "center center",
              position: "relative",
            }}
          >
            <RenderConcentricCircles
              skillnodes={circularSkillNodes}
              centerX={centerX}
              centerY={centerY}
              options={{ animationEnabled }}
              containerWidth={containerSize.width}
              containerHeight={containerSize.height}
            />

            <div className="animate-in slide-in-from-bottom-4 duration-1000 delay-300">
              {circularSkillNodes.map((node, index) => (
                <div
                  key={node.id}
                  className="animate-in zoom-in-0 fade-in-0 duration-500"
                  style={{
                    animationDelay: `${400 + index * 100}ms`,
                    animationFillMode: "both",
                  }}
                >
                  {renderNode(node)}
                </div>
              ))}
            </div>

            <ConnectionsRenderer
              nodes={circularSkillNodes}
              hoveredNode={hoveredNode}
              activeNodePath={activeNodePath}
              highlightedPathNodes={highlightedPathNodes}
            />
          </div>
        )}
      </div>

      {selectedNodeData && <RenderNodeDetails selectedNodeData={selectedNodeData} />}

      {/* Skill Tree Legend */}
      <div
        className={`bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white rounded-lg border border-gray-700 shadow-2xl absolute top-20 right-4 z-10 flex flex-col transition-all duration-500 ease-in-out ${
          isLegendCollapsed ? "w-16 h-16" : "w-80 max-h-[calc(100vh-6rem)]"
        }`}
      >
        {/* Header with Collapse Button */}
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
            className={`bg-slate-700/80 hover:bg-slate-600/80 border-slate-500 text-slate-200 hover:text-white transition-all duration-300 ${
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
            {/* Node Types */}
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
                  <div className="w-5 h-5 rounded-full mr-3 bg-emerald-400 border-2 border-emerald-300"></div>
                  <div>
                    <span className="text-sm font-medium">COMPLETED</span>
                    <p className="text-xs text-gray-400">Quête terminée</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 rounded-full mr-3 bg-yellow-400 border-2 border-yellow-300"></div>
                  <div>
                    <span className="text-sm font-medium">IN_PROGRESS</span>
                    <p className="text-xs text-gray-400">Quête en cours</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 rounded-full mr-3 bg-gray-500 border-2 border-gray-400"></div>
                  <div>
                    <span className="text-sm font-medium">NOT_STARTED</span>
                    <p className="text-xs text-gray-400">Quête disponible</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 rounded-full mr-3 bg-slate-800 border-2 border-red-600"></div>
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
            <div className="mb-6">
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
            </div>

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
    </div>
  );
};
