import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import type { SkillNodeData } from "../canva.type";
import { Textarea } from "@/shared/components/ui/textarea";
import { Card, CardHeader } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";

export default function SkillNode({ data }: NodeProps<Node<SkillNodeData>>) {
  return (
    <Card
      className={`w-96 bg-gradient-to-r ${data.config.color} text-white border-2 border-white shadow-lg`}
    >
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-4 h-4 bg-white"
      />
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">{data.config.icon}</span>
          <Input
            value={data.config.title}
            onChange={(e) => data.onUpdate("title", e.target.value)}
            className="text-xl font-bold bg-transparent border-none text-white placeholder-white/70 p-0 h-auto focus-visible:ring-0"
            placeholder="Skill Title"
          />
        </div>
        <Textarea
          value={data.config.description}
          onChange={(e) => data.onUpdate("description", e.target.value)}
          className="text-sm bg-white/20 border-white/30 text-white placeholder-white/70 resize-none"
          placeholder="Skill description..."
          rows={2}
        />
      </CardHeader>
    </Card>
  );
}
