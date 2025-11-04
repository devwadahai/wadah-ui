import { AgentCard } from "@/components/AgentCard";
import { SearchBar } from "@/components/SearchBar";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Plus, Filter, Grid3x3, List } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import supportIcon from '@assets/generated_images/Support_chatbot_agent_icon_53b273ce.png';
import ragIcon from '@assets/generated_images/RAG_system_agent_icon_29ac35fc.png';
import devopsIcon from '@assets/generated_images/DevOps_automation_bot_icon_535072b3.png';
import analyticsIcon from '@assets/generated_images/Data_analytics_agent_icon_77101b70.png';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Agents() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const mockAgents = [
    {
      id: '1',
      name: 'Support Chatbot',
      version: '1.0.0',
      status: 'running' as const,
      runCount: 1247,
      image: supportIcon,
      description: 'Handles customer support inquiries with AI-powered responses',
    },
    {
      id: '2',
      name: 'RAG Service',
      version: '0.1.0',
      status: 'paused' as const,
      runCount: 125,
      image: ragIcon,
      description: 'Document retrieval and question answering system',
    },
    {
      id: '3',
      name: 'DevOps Bot',
      version: '0.2.1',
      status: 'running' as const,
      runCount: 89,
      image: devopsIcon,
      description: 'Automated deployment and monitoring assistant',
    },
    {
      id: '4',
      name: 'Data Analyzer',
      version: '1.2.0',
      status: 'stopped' as const,
      runCount: 456,
      image: analyticsIcon,
      description: 'Automated data analysis and insights generation',
    },
  ];

  const filteredAgents = mockAgents.filter(agent =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Agents</h1>
          <p className="text-muted-foreground">
            Manage and monitor your AI agents
          </p>
        </div>
        <Button onClick={() => setLocation('/agents/new')} data-testid="button-create-agent">
          <Plus className="h-4 w-4 mr-2" />
          New Agent
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <SearchBar
          placeholder="Search agents..."
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
            <DropdownMenuItem>All Agents</DropdownMenuItem>
            <DropdownMenuItem>Running</DropdownMenuItem>
            <DropdownMenuItem>Paused</DropdownMenuItem>
            <DropdownMenuItem>Stopped</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex gap-1">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("grid")}
            data-testid="button-view-grid"
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("list")}
            data-testid="button-view-list"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {filteredAgents.length === 0 ? (
        <EmptyState
          title="No agents found"
          description="Try adjusting your search or create a new agent"
          actionLabel="Create Agent"
          onAction={() => setLocation('/agents/new')}
        />
      ) : (
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
          {filteredAgents.map((agent) => (
            <AgentCard
              key={agent.id}
              {...agent}
              onView={() => setLocation(`/agents/${agent.id}`)}
              onStart={() => console.log('Start agent', agent.id)}
              onPause={() => console.log('Pause agent', agent.id)}
              onDelete={() => console.log('Delete agent', agent.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
