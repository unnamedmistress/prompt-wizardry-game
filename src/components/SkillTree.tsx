import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CheckCircle, Lock, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SkillNode {
  id: string;
  title: string;
  icon: string;
  position: { x: number; y: number };
  completed: boolean;
  locked: boolean;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  connections?: string[]; // IDs of nodes this connects to
}

interface SkillTreeProps {
  nodes: SkillNode[];
  onNodeClick: (nodeId: string) => void;
}

const difficultyColors = {
  Beginner: "bg-green-500/10 text-green-500",
  Intermediate: "bg-yellow-500/10 text-yellow-500",
  Advanced: "bg-red-500/10 text-red-500"
};

export function SkillTree({ nodes, onNodeClick }: SkillTreeProps) {
  return (
    <div className="relative w-full min-h-[600px] bg-gradient-to-br from-background via-primary/5 to-accent/5 rounded-lg border border-primary/20 overflow-auto">
      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
        {nodes.map((node) => 
          node.connections?.map((targetId) => {
            const target = nodes.find(n => n.id === targetId);
            if (!target) return null;
            
            return (
              <line
                key={`${node.id}-${targetId}`}
                x1={node.position.x}
                y1={node.position.y}
                x2={target.position.x}
                y2={target.position.y}
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray={node.completed ? "0" : "5,5"}
                className={cn(
                  "transition-all",
                  node.completed ? "text-primary" : "text-muted"
                )}
              />
            );
          })
        )}
      </svg>

      {/* Nodes */}
      {nodes.map((node) => (
        <Card
          key={node.id}
          className={cn(
            "absolute -translate-x-1/2 -translate-y-1/2 w-32 cursor-pointer transition-all hover:scale-110",
            node.locked && "opacity-60 cursor-not-allowed hover:scale-100",
            node.completed && "ring-2 ring-green-500/50"
          )}
          style={{
            left: `${node.position.x}px`,
            top: `${node.position.y}px`,
            zIndex: 1
          }}
          onClick={() => !node.locked && onNodeClick(node.id)}
        >
          <div className="p-3 space-y-2 text-center">
            {/* Status icon */}
            <div className="flex justify-center">
              {node.locked ? (
                <Lock className="w-5 h-5 text-muted-foreground" />
              ) : node.completed ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <Circle className="w-5 h-5 text-primary" />
              )}
            </div>
            
            {/* Node icon */}
            <div className="text-2xl">{node.icon}</div>
            
            {/* Title */}
            <h3 className="text-xs font-semibold text-foreground leading-tight line-clamp-2">
              {node.title}
            </h3>
            
            {/* Difficulty badge */}
            <Badge 
              variant="outline" 
              className={`text-xs px-1 py-0 ${difficultyColors[node.difficulty]}`}
            >
              {"⚡".repeat(node.difficulty === "Beginner" ? 1 : node.difficulty === "Intermediate" ? 2 : 3)}
            </Badge>
          </div>
        </Card>
      ))}
    </div>
  );
}
