import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { ArrowLeft, Play, Pause, Trash2, Edit, Loader2, AlertCircle } from "lucide-react";
import { useLocation, useParams } from "wouter";
import { useState, useEffect } from "react";
import supportIcon from '@assets/generated_images/Support_chatbot_agent_icon_53b273ce.png';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Agent {
  id: string;
  name: string;
  path: string;
  manifest: string;
  createdAt: string;
  modifiedAt: string;
}

export default function AgentDetails() {
  const [, setLocation] = useLocation();
  const params = useParams<{ id: string }>();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAgent();
  }, [params.id]);

  const loadAgent = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (window.wadahAPI) {
        const result = await window.wadahAPI.getAgent(params.id!);
        if (result.success && result.agent) {
          setAgent(result.agent);
        } else {
          setError(result.error || 'Failed to load agent');
        }
      } else {
        setError('Not running in Electron mode');
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const formatName = (name: string) => {
    return name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading agent...</p>
        </div>
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation('/agents')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Agent Not Found</h1>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || 'Agent not found'}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation('/agents')}
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
              <img src={supportIcon} alt="Agent" className="w-12 h-12 object-contain" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{formatName(agent.name)}</h1>
              <p className="text-muted-foreground text-sm">{agent.id}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            data-testid="button-edit"
            onClick={() => setLocation(`/agents/new?edit=${agent.id}`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button 
            data-testid="button-run"
            onClick={() => setLocation(`/runs/new?agent=${agent.id}`)}
          >
            <Play className="h-4 w-4 mr-2" />
            Run Now
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusBadge status="stopped" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Created</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{new Date(agent.createdAt).toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Last Modified</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{new Date(agent.modifiedAt).toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Location</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs font-mono bg-muted p-3 rounded-md">{agent.path}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Agent Manifest (wadah.yaml)</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs font-mono bg-muted p-4 rounded-md overflow-auto max-h-96">
            {agent.manifest}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
