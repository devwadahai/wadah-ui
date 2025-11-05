import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Play, Loader2, CheckCircle2, XCircle, Terminal, Folder, Package, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { executeWadahCommand } from "@/lib/electron";

interface Agent {
  name: string;
  path: string;
  hasManifest: boolean;
}

interface RunHistory {
  agent: string;
  prompt: string;
  success: boolean;
  timestamp: string;
}

export default function RunNew() {
  const [, setLocation] = useLocation();
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<{ success: boolean; output?: string; error?: string } | null>(null);
  const [agentPath, setAgentPath] = useState("");
  const [selectedAgentName, setSelectedAgentName] = useState("");
  const [prompt, setPrompt] = useState("");
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loadingAgents, setLoadingAgents] = useState(true);
  const [runHistory, setRunHistory] = useState<RunHistory[]>([]);
  const [envVars, setEnvVars] = useState<Record<string, string>>({});

  // Load agents on mount
  useEffect(() => {
    loadAgents();
    loadRunHistory();
    loadEnvVars();
  }, []);

  // Get agent from URL if provided
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const agent = params.get('agent');
    if (agent && agents.length > 0) {
      setSelectedAgentName(agent);
      const agentManifestPath = `/Users/hsp/wadah-workspace/agents/${agent}/wadah.yaml`;
      setAgentPath(agentManifestPath);
    }
  }, [agents]);

  const loadAgents = async () => {
    setLoadingAgents(true);
    try {
      if (window.wadahAPI) {
        const result = await window.wadahAPI.listAgents();
        if (result.success && result.agents) {
          setAgents(result.agents);
        }
      }
    } catch (error) {
      console.error('Failed to load agents:', error);
    } finally {
      setLoadingAgents(false);
    }
  };

  const loadEnvVars = async () => {
    try {
      if (window.wadahAPI) {
        const result = await window.wadahAPI.getEnv();
        if (result) {
          setEnvVars(result);
        }
      }
    } catch (error) {
      console.error('Failed to load env vars:', error);
    }
  };

  const loadRunHistory = () => {
    try {
      const saved = localStorage.getItem('runHistory');
      if (saved) {
        setRunHistory(JSON.parse(saved).slice(0, 5)); // Keep last 5 runs
      }
    } catch (error) {
      console.error('Failed to load run history:', error);
    }
  };

  const saveToHistory = (agent: string, prompt: string, success: boolean) => {
    try {
      const newRun: RunHistory = {
        agent,
        prompt: prompt.slice(0, 100), // Truncate long prompts
        success,
        timestamp: new Date().toISOString(),
      };
      const updated = [newRun, ...runHistory].slice(0, 5);
      setRunHistory(updated);
      localStorage.setItem('runHistory', JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save run history:', error);
    }
  };

  const handleAgentChange = (value: string) => {
    setSelectedAgentName(value);
    const agent = agents.find(a => a.name === value);
    if (agent) {
      setAgentPath(`${agent.path}/wadah.yaml`);
    }
  };

  const handleRun = async () => {
    if (!agentPath || !prompt) {
      setResult({
        success: false,
        error: "Please provide both agent path and prompt"
      });
      return;
    }

    setRunning(true);
    setResult(null);

    try {
      const response = await executeWadahCommand('run', {
        specPath: agentPath,
        options: {
          prompt,
        }
      });

      setResult(response);
      
      // Save to history
      saveToHistory(selectedAgentName || 'unknown', prompt, response.success);
    } catch (error) {
      setResult({
        success: false,
        error: String(error)
      });
      saveToHistory(selectedAgentName || 'unknown', prompt, false);
    } finally {
      setRunning(false);
    }
  };

  const selectAgentFile = async () => {
    try {
      if (window.wadahAPI) {
        const path = await window.wadahAPI.selectFile();
        if (path) {
          setAgentPath(path);
        }
      }
    } catch (error) {
      console.error('Failed to select file:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation('/runs')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Run Agent</h1>
            <p className="text-muted-foreground">
              Execute an agent with a prompt
            </p>
          </div>
        </div>
        <Button
          onClick={handleRun}
          disabled={running || !agentPath || !prompt}
        >
          {running ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Run Agent
            </>
          )}
        </Button>
      </div>

      {result && (
        <Alert variant={result.success ? "default" : "destructive"}>
          <div className="flex items-start gap-2">
            {result.success ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5" />
            )}
            <div className="flex-1">
              <AlertDescription>
                {result.success ? (
                  <div className="space-y-2">
                    <p className="font-medium text-green-700 dark:text-green-400">
                      ✅ Agent executed successfully
                    </p>
                    {result.output && (
                      <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-40">
                        {result.output}
                      </pre>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="font-medium">❌ Execution Failed</p>
                    <p className="text-sm">{result.error}</p>
                  </div>
                )}
              </AlertDescription>
            </div>
          </div>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Agent Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="agentSelect">Select Agent *</Label>
              <Select
                value={selectedAgentName}
                onValueChange={handleAgentChange}
                disabled={running || loadingAgents}
              >
                <SelectTrigger id="agentSelect">
                  <SelectValue placeholder={loadingAgents ? "Loading agents..." : "Choose an agent"} />
                </SelectTrigger>
                <SelectContent>
                  {agents.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No agents found
                    </SelectItem>
                  ) : (
                    agents.map((agent) => (
                      <SelectItem key={agent.name} value={agent.name}>
                        <div className="flex items-center gap-2">
                          <Package className="h-3 w-3" />
                          {agent.name}
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Select from your available agents
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="agentPath">Agent Manifest Path</Label>
              <div className="flex gap-2">
                <Input
                  id="agentPath"
                  placeholder="/path/to/wadah.yaml"
                  value={agentPath}
                  onChange={(e) => setAgentPath(e.target.value)}
                  disabled={running}
                  className="font-mono text-xs"
                />
                {window.wadahAPI && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={selectAgentFile}
                    disabled={running}
                  >
                    <Folder className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Auto-filled when you select an agent above
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prompt">Prompt *</Label>
              <Textarea
                id="prompt"
                placeholder="Enter your prompt here..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={running}
                className="min-h-32"
              />
              <p className="text-xs text-muted-foreground">
                The prompt to send to the agent
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <Terminal className="h-4 w-4" />
                Execution Info:
              </h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>• Agent will be executed with the provided prompt</li>
                <li>• Output will be displayed in real-time</li>
                <li>• Traces are saved for debugging</li>
                <li>• Check Settings for API keys</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Command Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Command that will be executed:</Label>
              <pre className="mt-2 text-xs font-mono bg-muted p-4 rounded-md overflow-auto">
                {`wadah run ${agentPath || '<agent-path>'} --prompt "${prompt.slice(0, 50) || '<prompt>'}${prompt.length > 50 ? '...' : ''}"`}
              </pre>
            </div>

            <div className="space-y-2">
              <Label>Environment</Label>
              <div className="text-xs space-y-1">
                <div className="flex justify-between p-2 bg-muted rounded">
                  <span className="text-muted-foreground">OPENAI_API_KEY</span>
                  <span>{envVars.OPENAI_API_KEY ? '✓ Set' : '✗ Not set'}</span>
                </div>
                <div className="flex justify-between p-2 bg-muted rounded">
                  <span className="text-muted-foreground">OLLAMA_URL</span>
                  <span>{envVars.OLLAMA_URL || 'http://localhost:11434'}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Configure API keys in Settings
              </p>
            </div>

            <div>
              <Label>Example Prompts:</Label>
              <div className="mt-2 space-y-2">
                {[
                  "Hello! How can you help me?",
                  "Analyze the latest metrics",
                  "Check system health",
                  "Generate a report",
                ].map((example, i) => (
                  <button
                    key={i}
                    onClick={() => setPrompt(example)}
                    disabled={running}
                    className="block w-full text-left text-xs p-2 bg-muted hover:bg-muted/80 rounded transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Runs */}
      {runHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Runs
            </CardTitle>
            <CardDescription>
              Your last {runHistory.length} agent executions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {runHistory.map((run, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedAgentName(run.agent);
                    const agent = agents.find(a => a.name === run.agent);
                    if (agent) {
                      setAgentPath(`${agent.path}/wadah.yaml`);
                    }
                    setPrompt(run.prompt);
                  }}
                >
                  {run.success ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{run.agent}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(run.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {run.prompt}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

