import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchBar } from "@/components/SearchBar";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Filter, Download, RefreshCw, Clock, Zap } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Run {
  id: string;
  agentName: string;
  status: "running" | "success" | "error";
  startedAt: string;
  duration?: string;
  cost: string;
  tokens: number;
}

export default function Runs() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const mockRuns: Run[] = [
    {
      id: '1',
      agentName: 'RAG Service',
      status: 'success',
      startedAt: '2024-11-03 10:23:45',
      duration: '45s',
      cost: '$0.023',
      tokens: 450,
    },
    {
      id: '2',
      agentName: 'DevOps Bot',
      status: 'running',
      startedAt: '2024-11-03 10:25:12',
      cost: '$0.000',
      tokens: 0,
    },
    {
      id: '3',
      agentName: 'Support Agent',
      status: 'success',
      startedAt: '2024-11-03 10:18:30',
      duration: '1m 23s',
      cost: '$0.041',
      tokens: 823,
    },
    {
      id: '4',
      agentName: 'Data Analyzer',
      status: 'error',
      startedAt: '2024-11-03 10:11:22',
      duration: '12s',
      cost: '$0.008',
      tokens: 156,
    },
    {
      id: '5',
      agentName: 'Content Generator',
      status: 'success',
      startedAt: '2024-11-03 10:05:15',
      duration: '2m 10s',
      cost: '$0.067',
      tokens: 1342,
    },
  ];

  const filteredRuns = mockRuns.filter(run =>
    run.agentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    run.id.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Runs</h1>
          <p className="text-muted-foreground">
            Monitor all agent execution history
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" data-testid="button-refresh">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" data-testid="button-export">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <SearchBar
          placeholder="Search runs..."
          value={searchQuery}
          onChange={setSearchQuery}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" data-testid="button-filter">
              <Filter className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>All Runs</DropdownMenuItem>
            <DropdownMenuItem>Running</DropdownMenuItem>
            <DropdownMenuItem>Success</DropdownMenuItem>
            <DropdownMenuItem>Error</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Run History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredRuns.map((run) => (
              <div
                key={run.id}
                className="flex items-center justify-between p-4 rounded-lg border hover-elevate cursor-pointer"
                onClick={() => setLocation(`/runs/${run.id}`)}
                data-testid={`row-run-${run.id}`}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate" data-testid={`text-agent-name-${run.id}`}>
                      {run.agentName}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {run.startedAt}
                      </span>
                      {run.duration && (
                        <span>Duration: {run.duration}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-sm">
                      <p className="text-muted-foreground text-xs">Tokens</p>
                      <p className="font-medium flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        {run.tokens.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-sm">
                      <p className="text-muted-foreground text-xs">Cost</p>
                      <p className="font-medium">{run.cost}</p>
                    </div>
                    <StatusBadge status={run.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
