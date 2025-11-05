import { AgentCard } from "@/components/AgentCard";
import { SearchBar } from "@/components/SearchBar";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Plus, Filter, Grid3x3, List, Loader2, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
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
import { executeWadahCommand } from "@/lib/electron";

interface Agent {
  id: string;
  name: string;
  version: string;
  status: 'running' | 'paused' | 'stopped';
  runCount: number;
  image: string;
  description: string;
  path?: string;
}

// Map agent names to icons
const iconMap: Record<string, string> = {
  'support': supportIcon,
  'rag': ragIcon,
  'devops': devopsIcon,
  'chatbot': supportIcon,
  'bot': devopsIcon,
  'analyzer': analyticsIcon,
  'analytics': analyticsIcon,
};

function getIconForAgent(name: string): string {
  const lowerName = name.toLowerCase();
  for (const [key, icon] of Object.entries(iconMap)) {
    if (lowerName.includes(key)) {
      return icon;
    }
  }
  return analyticsIcon; // default
}

export default function Agents() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    setLoading(true);
    
    try {
      const result = await executeWadahCommand('list-agents', {});
      
      if (result.success && result.agents) {
        // Convert to UI format
        const loadedAgents: Agent[] = result.agents.map((agent: any, index: number) => ({
          id: agent.name,
          name: agent.name.split('-').map((w: string) => 
            w.charAt(0).toUpperCase() + w.slice(1)
          ).join(' '),
          version: '0.1.0',
          status: agent.hasManifest ? 'stopped' : 'paused',
          runCount: 0,
          image: getIconForAgent(agent.name),
          description: `Agent located at ${agent.path}`,
          path: agent.path,
        }));

        setAgents(loadedAgents);
      } else {
        // Fallback to mock data
        setAgents([
    {
      id: '1',
      name: 'Support Chatbot',
      version: '1.0.0',
            status: 'running',
      runCount: 1247,
      image: supportIcon,
      description: 'Handles customer support inquiries with AI-powered responses',
    },
    {
      id: '2',
      name: 'RAG Service',
      version: '0.1.0',
            status: 'paused',
      runCount: 125,
      image: ragIcon,
      description: 'Document retrieval and question answering system',
    },
    {
      id: '3',
      name: 'DevOps Bot',
      version: '0.2.1',
            status: 'running',
      runCount: 89,
      image: devopsIcon,
      description: 'Automated deployment and monitoring assistant',
    },
        ]);
      }
    } catch (error) {
      console.error('Failed to load agents:', error);
      // Show empty state
      setAgents([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || agent.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading agents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Agents</h1>
          <p className="text-muted-foreground">
            Manage and monitor your AI agents from wadah workspace
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={loadAgents}
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button onClick={() => setLocation('/agents/new')}>
          <Plus className="h-4 w-4 mr-2" />
          New Agent
        </Button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <SearchBar
          placeholder="Search agents..."
          value={searchQuery}
          onChange={setSearchQuery}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Agents</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("running")}>Running</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("paused")}>Paused</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("stopped")}>Stopped</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex gap-1">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {filteredAgents.length === 0 ? (
        <EmptyState
          title={agents.length === 0 ? "No agents yet" : "No agents found"}
          description={agents.length === 0 
            ? "Create your first agent to get started" 
            : "Try adjusting your search or filter"}
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
              onStart={() => setLocation(`/runs/new?agent=${agent.id}`)}
              onPause={() => console.log('Pause agent', agent.id)}
              onDelete={() => {
                if (confirm(`Delete agent "${agent.name}"?`)) {
                  console.log('Delete agent', agent.id);
                  loadAgents();
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
