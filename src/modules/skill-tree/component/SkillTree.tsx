import { SkillTreeLoader } from "@/component/SkillTreeLoader";
import type { QuestNodeData, SkillNodeData } from "@/modules/canvas/canvas.type";
import { Button } from "@/shared/components/ui/button";
import type { Edge, Node } from "@xyflow/react";
import { ChevronLeft, PauseIcon, PlayIcon } from "lucide-react";
import { useCallback, useState } from "react";
import type { SkillTreeLayoutType, SkillTreeNode, CircularSkillNode, HierarchicalSkillNode } from "../skill-tree.type";
import { RenderConcentricCircles } from "./concentric-circles/RenderConcentricCircles";
import { NodeRenderer } from "./render-node-component/NodeRenderer";
import { ConnectionsRenderer } from "./render-node-connections/ConnectionsRenderer";
import { HierarchicalConnectionsRenderer } from "./render-node-connections/HierarchicalConnectionsRenderer";
import { RenderNodeDetails } from "./NodeDetails";
import { SkillTreeLegends } from "./SkillTreeLegends";
import { SkillTreeLayoutSelector } from "./SkillTreeLayoutSelector";
import { useContainerSize } from "../hooks/useContainerSize";
import { useSkillTreeLayout } from "../hooks/useSkillTreeLayout";

export type SkillTreeProps = {
  nodes: Node<QuestNodeData | SkillNodeData>[];
  edges: Edge[];
  layoutType?: SkillTreeLayoutType;
  minimalistView?: boolean;
  onBack?: () => void;
  onLayoutChange?: (layout: SkillTreeLayoutType) => void;
};

export const SkillTree = ({
  nodes,
  edges,
  layoutType: propLayoutType,
  minimalistView,
  onBack,
  onLayoutChange,
}: SkillTreeProps) => {
  const [animationEnabled, setAnimationEnabled] = useState(true);
  const [zoom, setZoom] = useState(minimalistView ? 0.5 : 1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);

  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [activeNodePath, setActiveNodePath] = useState<string[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [highlightedPathNodes, setHighlightedPathNodes] = useState<string[]>([]);

  const { ref: skillTreeContainerRef, size: containerSize } = useContainerSize();

  // Use the new layout hook
  const { layoutType, skillTreeNodes, dependencyGraph, isLoading, changeLayoutType, availableLayouts } =
    useSkillTreeLayout({
      nodes,
      edges,
      containerWidth: containerSize.width,
      containerHeight: containerSize.height,
      initialLayoutType: propLayoutType || "circular",
    });

  // Handle layout change from props or internal selector
  const handleLayoutChange = useCallback(
    (newLayoutType: SkillTreeLayoutType) => {
      changeLayoutType(newLayoutType);
      onLayoutChange?.(newLayoutType);
    },
    [changeLayoutType, onLayoutChange],
  );

  const handleNodeClick = useCallback(
    (e: React.MouseEvent, nodeId: string) => {
      e.stopPropagation();
      setIsPanning(false);

      const node = skillTreeNodes.find((n) => n.id === nodeId);
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
    [skillTreeNodes, dependencyGraph],
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
    (node: SkillTreeNode) => {
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

  const selectedNodeData = skillTreeNodes.find((n) => n.id === selectedNode);

  return (
    <div className="w-full h-screen relative overflow-auto flex items-center justify-center bg-slate-900">
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
      {!minimalistView && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAnimationEnabled(!animationEnabled)}
            className="absolute cursor-pointer top-16 right-4 z-10 bg-slate-700/80 backdrop-blur-sm border-slate-500 hover:bg-slate-600/80 text-slate-200 hover:text-white transition-all duration-200 font-medium shadow-lg"
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

          <SkillTreeLayoutSelector
            currentLayout={layoutType}
            availableLayouts={availableLayouts}
            onLayoutChange={handleLayoutChange}
            className="absolute top-4 right-4 z-10"
          />
        </>
      )}
      <div
        ref={skillTreeContainerRef}
        className="w-full h-[400px] cursor-grab active:cursor-grabbing"
        style={{ overflow: "visible" }}
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
            {/* Render circular-specific elements only for circular layout */}
            {layoutType === "circular" && (
              <RenderConcentricCircles
                skillnodes={skillTreeNodes as CircularSkillNode[]}
                centerX={containerSize.width / 2}
                centerY={containerSize.height / 2}
                options={{ animationEnabled }}
                containerWidth={containerSize.width}
                containerHeight={containerSize.height}
              />
            )}

            {/* Render hierarchical-specific elements for hierarchical layout */}
            {layoutType === "hierarchical" && (
              <div className="absolute inset-0 pointer-events-none">
                {/* Grid lines or other hierarchical-specific background elements could go here */}
                <svg className="w-full h-full">
                  <defs>
                    <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                      <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#334155" strokeWidth="1" opacity="0.2" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>
            )}

            <div className="animate-in slide-in-from-bottom-4 duration-1000 delay-300">
              {skillTreeNodes.map((node, index) => (
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

            {/* Render connections based on layout type */}
            {layoutType === "circular" ? (
              <ConnectionsRenderer
                nodes={skillTreeNodes.filter((node) => "ring" in node) as CircularSkillNode[]}
                hoveredNode={hoveredNode}
                activeNodePath={activeNodePath}
                highlightedPathNodes={highlightedPathNodes}
              />
            ) : (
              <HierarchicalConnectionsRenderer
                nodes={skillTreeNodes.filter((node) => "level" in node) as HierarchicalSkillNode[]}
                hoveredNode={hoveredNode}
                activeNodePath={activeNodePath}
                highlightedPathNodes={highlightedPathNodes}
              />
            )}
          </div>
        )}
      </div>
      {selectedNodeData && !minimalistView && <RenderNodeDetails selectedNodeData={selectedNodeData} />}
      {/* Skill Tree Legend */}
      {skillTreeNodes.length > 0 && !minimalistView && <SkillTreeLegends />}
    </div>
  );
};
