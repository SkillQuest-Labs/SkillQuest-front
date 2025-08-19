import { SkillTreeLoader } from "@/component/SkillTreeLoader";
import type { QuestNodeData, SkillNodeData } from "@/modules/canvas/canvas.type";
import { Button } from "@/shared/components/ui/button";
import type { Edge, Node } from "@xyflow/react";
import { ChevronLeft, PauseIcon, PlayIcon } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { generateCircularSkillTreeData } from "../circular-skill-tree-logic/generate-circular-skill-tree-logic";
import type { DependencyGraph } from "../circular-skill-tree-logic/generate-circular-skill-tree-logic/dependency-graph";
import type { CircularSkillNode } from "../skill-tree.type";
import { RenderConcentricCircles } from "./concentric-circles/RenderConcentricCircles";
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
  const [activeNodePath] = useState<string[]>([]);
  const [activeSkillPath, setActiveSkillPath] = useState<string[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [highlightedPathNodes, setHighlightedPathNodes] = useState<string[]>([]);

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

      setActiveSkillPath((prev) => [...prev, nodeId]);
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

  const renderSkillNode = useCallback(
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
  };

  return (
    <div className="w-full h-screen overflow-hidden relative  flex items-center justify-center bg-slate-900">
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

            <ConnectionsRenderer
              nodes={circularSkillNodes}
              hoveredNode={hoveredNode}
              activeSkillPath={activeSkillPath}
              highlightedPathNodes={highlightedPathNodes}
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
                  {renderSkillNode(node)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
