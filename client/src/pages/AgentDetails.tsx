import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { ArrowLeft, Play, Pause, Trash2, Edit } from "lucide-react";
import { useLocation, useParams } from "wouter";
import supportIcon from '@assets/generated_images/Support_chatbot_agent_icon_53b273ce.png';

export default function AgentDetails() {
  const [, setLocation] = useLocation();
  const params = useParams<{ id: string }>();

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
              <h1 className="text-3xl font-bold">Support Chatbot</h1>
              <p className="text-muted-foreground">v1.0.0</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" data-testid="button-edit">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" data-testid="button-pause">
            <Pause className="h-4 w-4 mr-2" />
            Pause
          </Button>
          <Button data-testid="button-run">
            <Play className="h-4 w-4 mr-2" />
            Run Now
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusBadge status="running" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Total Runs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">1,247</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Avg. Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">52s</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Total Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$142.50</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Handles customer support inquiries with AI-powered responses. 
            Trained on product documentation and common support queries.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs font-mono bg-muted p-4 rounded-md overflow-auto">
{`name: support-chatbot
version: 1.0.0
description: Customer support chatbot

runtime:
  model: gpt-4
  temperature: 0.7
  max_tokens: 500

config:
  system_prompt: |
    You are a helpful customer support agent.
    Always be polite and professional.`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
