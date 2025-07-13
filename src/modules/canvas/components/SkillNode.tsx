import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import type { SkillNodeData } from "../canvas.type";
import { Textarea } from "@/shared/components/ui/textarea";
import { Card, CardHeader } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";

export const SkillNode = ({ data }: NodeProps<Node<SkillNodeData>>) => {
  return (
    <Card className="w-[36rem] min-h-[14rem] bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-2 border-white shadow-lg">
      <Handle type="source" position={Position.Bottom} className="w-6 h-6 bg-white" />
      <CardHeader>
        <div className="flex items-center gap-5 mb-4">
          <span className="text-4xl">💻</span>
          <Input
            value={data.config.title}
            onChange={(e) => data.onUpdate?.("title", e.target.value)}
            className="text-3xl font-bold bg-transparent border-none text-white placeholder-white/70 p-0 h-auto focus-visible:ring-0"
            placeholder="Skill Title"
            style={{ fontSize: "2rem", minHeight: "3rem" }}
          />
        </div>
        <Textarea
          value={data.config.description}
          onChange={(e) => data.onUpdate?.("description", e.target.value)}
          className="text-xl bg-white/20 border-white/30 text-white placeholder-white/70 resize-none"
          placeholder="Décrivez cette compétence en détail..."
          rows={8}
          style={{ fontSize: "1.5rem", minHeight: "7rem" }}
        />
      </CardHeader>
    </Card>
  );
};
