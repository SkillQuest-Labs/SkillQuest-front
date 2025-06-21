import { useState } from 'react';
import type { CursorModeType, SkillConfigType, SkillNodeData, ViewModeType } from './canva.type';
import { Background, Controls, MiniMap, ReactFlow, useEdgesState, useNodesState, type Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { FloatingToolbox } from './components/FloatingToolbox';
import { skillConfigMockData } from './canvas.const';
import { SkillNode } from './components/SkillNode';
import { QuestNode, QuestNode2 } from './components/QuestNode';
import './../../styles/canvas.css';
import { CustomEdge } from './components/CustomEdge';

const nodeTypes = {
  skill: SkillNode,
  quest1: QuestNode,
  quest2: QuestNode2,
};

const edgeTypes = {
  custom: CustomEdge,
};

export const Canva = () => {
  const [cursorMode, setCursorMode] = useState<CursorModeType>('normal');
  const [, setViewMode] = useState<ViewModeType>('canvas');
  const [skillConfig, setSkillConfig] = useState<SkillConfigType>(skillConfigMockData);

  // Initialize edges and nodes

  const initialNodes: Node<SkillNodeData>[] = [
    // later we need to retrieve the real data from the modal that we open
    {
      id: 'skill-block',
      type: 'skill',
      position: { x: 400, y: 50 },
      data: {
        config: skillConfig,
        onUpdate: (field: string, value: any) => setSkillConfig((prev) => ({ ...prev, [field]: value })),
      },
      draggable: true,
    },
    {
      id: 'quest-block1',
      type: 'quest1',
      position: { x: 500, y: 400 },
      data: {
        config: skillConfig,
        onUpdate: (field: string, value: any) => setSkillConfig((prev) => ({ ...prev, [field]: value })),
      },
      draggable: true,
    },
    {
      id: 'quest-block2',
      type: 'quest2',
      position: { x: 500, y: 200 },
      data: {
        config: skillConfig,
        onUpdate: (field: string, value: any) => setSkillConfig((prev) => ({ ...prev, [field]: value })),
      },
      draggable: true,
    },
  ];

  const [edges, setEdges, onEdgesChange] = useEdgesState([
    // Initial edges connecting the nodes

    {
      id: 'e1-3',
      source: 'skill-block',
      target: 'quest-block1',
      type: 'custom',
      animated: true,
    },
  ]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);

  return (
    <div className="h-screen bg-gray-50 relative ">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        className="custom-canvas"
      >
        <Background color="#aaa" gap={20} size={1} />

        <Controls position="bottom-right" />

        <MiniMap
          nodeStrokeWidth={1}
          position="bottom-left"
          nodeColor={(node) => {
            return node.type === 'skill' ? '#ff0000' : '#aaa';
          }}
        />

        {/* Mode Indicators */}
        {cursorMode === 'create' && (
          <div className="absolute top-4 left-4 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium z-10 animate-pulse">
            ➕ Click anywhere to create a quest
          </div>
        )}

        {cursorMode === 'connect' && (
          <div className="absolute top-4 left-4 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium z-10 animate-pulse">
            🔗 Click quests to connect them
            {/* {connectionStart && <span className="ml-2 text-purple-600">→ Select target quest</span>} */}
          </div>
        )}

        <FloatingToolbox cursorMode={cursorMode} setCursorMode={setCursorMode} setViewMode={setViewMode} />
      </ReactFlow>
    </div>
  );
};
