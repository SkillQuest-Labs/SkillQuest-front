import { SkillTreeLoader } from "@/component/SkillTreeLoader";
import type { QuestNodeData, SkillNodeData } from "@/modules/canvas/canvas.type";
import type { Edge, Node } from "@xyflow/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { generateCircularSkillTreeData } from "../circular-skill-tree-logic/generate-circular-skill-tree-logic";
import type { DependencyGraph } from "../circular-skill-tree-logic/generate-circular-skill-tree-logic/dependency-graph";
import { useContainerSize } from "../hooks/useContainerSize";
import type { CircularSkillNode } from "../skill-tree.type";
import { LayoutToggle } from "./LayoutToggle";
import { RenderNodeDetails } from "./NodeDetails";
import { NodeRenderer } from "./render-node-component/NodeRenderer";
import { ConnectionsRenderer } from "./render-node-connections/ConnectionsRenderer";
import { SkillTreeNavigation } from "./SkillTreeNavigation";
import { RenderConcentricCircles } from "./concentric-circles/RenderConcentricCircles";

type LayoutType = "spiral" | "concentric";

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
  const [layoutType, setLayoutType] = useState<LayoutType>(nodes.length >= 10 ? "spiral" : "concentric");

  const handleLayoutChange = (newLayoutType: LayoutType) => {
    setLayoutType(newLayoutType);
  };

  const [zoom, setZoom] = useState<number>(0.5);
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
    if (layoutType === "spiral") {
      setZoom(1);
    } else if (layoutType === "concentric") {
      if (nodes.length < 10) {
        setZoom(0.8);
      } else {
        setZoom(0.5);
      }
    } else {
      setZoom(0.75);
    }
  }, [nodes, layoutType]);

  useEffect(() => {
    hasGenerated.current = false;
  }, [layoutType]);

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
        forceLayoutType: layoutType === "spiral" ? "spiral" : "concentric",
      });

      setCircularSkillNodes(circularSkillNodes);
      setDependencyGraph(graph);
      setIsLoading(false);
      hasGenerated.current = true;
    };

    generateNodes();
  }, [nodes, edges, containerSize, minimalistView, layoutType]);

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
      // Calculer le nombre total de quêtes (exclure les nœuds de compétence)
      const questNodes = nodes.filter((n) => n.data.kind !== "skill");
      const totalQuestCount = questNodes.length;

      return NodeRenderer({
        node,
        activeNodePath,
        hoveredNode,
        selectedNode,
        highlightedPathNodes,
        handleNodeClick,
        setHoveredNode,
        totalQuestCount,
      });
    },
    [activeNodePath, hoveredNode, selectedNode, highlightedPathNodes, handleNodeClick, nodes],
  );

  const handleSkillTreeCanvasClick = () => {
    setSelectedNode(null);
    setHighlightedPathNodes([]);
    setActiveNodePath([]);
  };

  const selectedNodeData = circularSkillNodes.find((n) => n.id === selectedNode);

  return (
    <div className="relative flex min-h-screen w-full overflow-hidden bg-slate-900 text-slate-100">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-soft-light"
        style={{
          backgroundImage:
            "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 400%22%3E%3Cdefs%3E%3CradialGradient id=%22g%22 cx=%220%22 cy=%220%22 r=%221%22 gradientUnits=%22userSpaceOnUse%22%3E%3Cstop stop-color=%22%23ffffff%22 stop-opacity=%220.9%22/%3E%3Cstop offset=%221%22 stop-color=%22%23000000%22 stop-opacity=%220%22/%3E%3C/radialGradient%3E%3C/defs%3E%3Cg fill=%22url(%23g)%22%3E%3Ccircle cx=%2250%22 cy=%2250%22 r=%22180%22/%3E%3Ccircle cx=%2290%22 cy=%2210%22 r=%22120%22/%3E%3Ccircle cx=%2210%22 cy=%2290%22 r=%2290%22/%3E%3C/g%3E%3C/svg%3E')",
          backgroundRepeat: "repeat",
          backgroundSize: "420px 420px",
        }}
      />

      <SkillTreeNavigation
        onBack={onBack}
        animationEnabled={animationEnabled}
        onToggleAnimation={() => setAnimationEnabled(!animationEnabled)}
      />

      <LayoutToggle layoutType={layoutType} onLayoutChange={handleLayoutChange} />

      <div className="relative z-10 flex w-full flex-1 items-center justify-center px-6 pb-16 pt-10">
        <div
          ref={skillTreeContainerRef}
          className="relative h-[70vh] w-full max-w-6xl cursor-grab active:cursor-grabbing"
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
              className="h-full w-full animate-in fade-in-0 duration-700"
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
      </div>

      {selectedNodeData && !minimalistView && <RenderNodeDetails selectedNodeData={selectedNodeData} />}
    </div>
  );
};
