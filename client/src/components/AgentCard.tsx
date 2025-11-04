import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import { MoreVertical, Play, Pause, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AgentCardProps {
  id: string;
  name: string;
  version: string;
  status: "running" | "paused" | "stopped";
  runCount: number;
  image?: string;
  description?: string;
  onView?: () => void;
  onStart?: () => void;
  onPause?: () => void;
  onDelete?: () => void;
}

export function AgentCard({
  id,
  name,
  version,
  status,
  runCount,
  image,
  description,
  onView,
  onStart,
  onPause,
  onDelete,
}: AgentCardProps) {
  return (
    <Card className="hover-elevate cursor-pointer" data-testid={`card-agent-${id}`} onClick={onView}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {image && (
            <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
              <img src={image} alt={name} className="w-8 h-8 object-contain" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate" data-testid={`text-agent-name-${id}`}>{name}</h3>
            <p className="text-xs text-muted-foreground">v{version}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" data-testid={`button-agent-menu-${id}`}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onStart?.(); }}>
              <Play className="h-4 w-4 mr-2" />
              Start
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onPause?.(); }}>
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{description}</p>
        )}
        <div className="flex items-center gap-2">
          <StatusBadge status={status} />
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground" data-testid={`text-run-count-${id}`}>
          {runCount.toLocaleString()} runs
        </p>
      </CardFooter>
    </Card>
  );
}
