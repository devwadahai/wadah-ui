import { StatsCard } from "@/components/StatsCard";
import { RecentRunsList } from "@/components/RecentRunsList";
import { Button } from "@/components/ui/button";
import { Bot, Activity, DollarSign, TrendingUp, Plus, FileText } from "lucide-react";
import { useLocation } from "wouter";

export default function Dashboard() {
  const [, setLocation] = useLocation();

  const mockRuns = [
    { id: '1', agentName: 'RAG Service', status: 'success' as const, timestamp: '2 minutes ago', duration: '45s' },
    { id: '2', agentName: 'DevOps Bot', status: 'running' as const, timestamp: 'just now' },
    { id: '3', agentName: 'Support Agent', status: 'success' as const, timestamp: '5 minutes ago', duration: '1m 23s' },
    { id: '4', agentName: 'Data Analyzer', status: 'error' as const, timestamp: '12 minutes ago', duration: '12s' },
    { id: '5', agentName: 'Content Generator', status: 'success' as const, timestamp: '18 minutes ago', duration: '2m 10s' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
        <p className="text-muted-foreground">
          Here's what's happening with your AI agents today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Agents"
          value={12}
          icon={Bot}
          trend={{ value: "+2 this week", isPositive: true }}
        />
        <StatsCard
          title="Active Runs"
          value={3}
          icon={Activity}
          description="Running now"
        />
        <StatsCard
          title="Cost Today"
          value="$45.20"
          icon={DollarSign}
          trend={{ value: "+12% from yesterday", isPositive: false }}
        />
        <StatsCard
          title="Uptime"
          value="99.9%"
          icon={TrendingUp}
          description="Last 30 days"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentRunsList
            runs={mockRuns}
            onRunClick={(id) => setLocation(`/runs/${id}`)}
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Quick Actions</h2>
          <div className="space-y-3">
            <Button
              className="w-full justify-start"
              onClick={() => setLocation('/agents/new')}
              data-testid="button-new-agent"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Agent
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setLocation('/templates')}
              data-testid="button-browse-templates"
            >
              <FileText className="h-4 w-4 mr-2" />
              Browse Templates
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
