import { SkillTreeLoader } from "@/component/SkillTreeLoader";
import type { QuestNodeData, SkillNodeData } from "@/modules/canvas/canvas.type";
import { Button } from "@/shared/components/ui/button";
import type { Edge, Node } from "@xyflow/react";
import { ChevronLeft, PauseIcon, PlayIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { generateCircularSkillTreeData } from "../circular-skill-tree-logic/generate-circular-skill-tree-logic";
import type { DependencyGraph } from "../circular-skill-tree-logic/generate-circular-skill-tree-logic/dependency-graph";
import type { CircularSkillNode } from "../skill-tree.type";
import { RenderConcentricCircles } from "./concentric-circles/RenderConcentricCircles";
import { NodeRenderer } from "./render-node-component/NodeRenderer";
import { ConnectionsRenderer } from "./render-node-connections/ConnectionsRenderer";
import { RenderNodeDetails } from "./NodeDetails";
import { SkillTreeLegends } from "./SkillTreeLegends";
import { useContainerSize } from "../hooks/useContainerSize";

export type SkillTreeDataProps = {
  nodes: CircularSkillNode[];
  graph: DependencyGraph;
};

export type SkillTreeProps = {
  nodes: Node<QuestNodeData | SkillNodeData>[];
  edges: Edge[];
  minimalistView?: boolean;
  onBack?: () => void;
};

export const SkillTree = ({ nodes, edges, onBack, minimalistView }: SkillTreeProps) => {
  const [animationEnabled, setAnimationEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [circularSkillNodes, setCircularSkillNodes] = useState<CircularSkillNode[]>([]);
  const [dependencyGraph, setDependencyGraph] = useState<DependencyGraph>();

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);

  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [activeNodePath, setActiveNodePath] = useState<string[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [highlightedPathNodes, setHighlightedPathNodes] = useState<string[]>([]);

  const { ref: skillTreeContainerRef, size: containerSize } = useContainerSize();

  const centerX = containerSize.width / 2;
  const centerY = containerSize.height / 2;

  const hasGenerated = useRef(false);
  useEffect(() => {
    if (hasGenerated.current) return;

    const generateNodes = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 300));

      if (minimalistView) {
        setZoom(0.5);
      }
      const { graph, circularSkillNodes } = generateCircularSkillTreeData({
        nodes,
        edges,
        centerX: containerSize.width / 2,
        centerY: containerSize.height / 2,
      });

      setCircularSkillNodes(circularSkillNodes);
      setDependencyGraph(graph);
      setIsLoading(false);
      hasGenerated.current = true;
    };

    generateNodes();
  }, [nodes, edges, containerSize, minimalistView]);

  const handleNodeClick = useCallback(
    (e: React.MouseEvent, nodeId: string) => {
      e.stopPropagation();
      setIsPanning(false);

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
    <div className="w-full h-screen relative overflow-hidden flex items-center justify-center bg-slate-900">
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
        <Button
          variant="outline"
          size="sm"
          onClick={() => setAnimationEnabled(!animationEnabled)}
          className="absolute cursor-pointer top-15 left-4 z-10 bg-slate-700/80 backdrop-blur-sm border-slate-500 hover:bg-slate-600/80 text-slate-200 hover:text-white transition-all duration-200 font-medium shadow-lg"
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
      )}
      <div
        ref={skillTreeContainerRef}
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
      {selectedNodeData && !minimalistView && <RenderNodeDetails selectedNodeData={selectedNodeData} />}
      {/* Skill Tree Legend */}
      {circularSkillNodes.length > 0 && !minimalistView && <SkillTreeLegends />}
    </div>
  );
};
