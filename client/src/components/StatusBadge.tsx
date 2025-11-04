import { Badge } from "@/components/ui/badge";
import { Circle } from "lucide-react";

type Status = "running" | "paused" | "stopped" | "success" | "error";

interface StatusBadgeProps {
  status: Status;
  showDot?: boolean;
}

const statusConfig = {
  running: {
    label: "Running",
    className: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    dotClassName: "fill-green-600 dark:fill-green-400",
  },
  paused: {
    label: "Paused",
    className: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    dotClassName: "fill-yellow-600 dark:fill-yellow-400",
  },
  stopped: {
    label: "Stopped",
    className: "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20",
    dotClassName: "fill-gray-600 dark:fill-gray-400",
  },
  success: {
    label: "Success",
    className: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    dotClassName: "fill-green-600 dark:fill-green-400",
  },
  error: {
    label: "Error",
    className: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    dotClassName: "fill-red-600 dark:fill-red-400",
  },
};

export function StatusBadge({ status, showDot = true }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant="outline" className={config.className} data-testid={`badge-status-${status}`}>
      {showDot && <Circle className={`h-2 w-2 mr-1.5 ${config.dotClassName}`} />}
      {config.label}
    </Badge>
  );
}
