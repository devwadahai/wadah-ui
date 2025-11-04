import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";
import { Clock } from "lucide-react";

interface Run {
  id: string;
  agentName: string;
  status: "running" | "success" | "error";
  timestamp: string;
  duration?: string;
}

interface RecentRunsListProps {
  runs: Run[];
  onRunClick?: (id: string) => void;
}

export function RecentRunsList({ runs, onRunClick }: RecentRunsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Runs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {runs.map((run) => (
            <div
              key={run.id}
              className="flex items-center justify-between p-3 rounded-lg hover-elevate cursor-pointer border"
              onClick={() => onRunClick?.(run.id)}
              data-testid={`row-run-${run.id}`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate" data-testid={`text-agent-name-${run.id}`}>{run.agentName}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <Clock className="h-3 w-3" />
                    <span>{run.timestamp}</span>
                    {run.duration && <span>• {run.duration}</span>}
                  </div>
                </div>
              </div>
              <StatusBadge status={run.status} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
