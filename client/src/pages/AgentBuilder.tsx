import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Save, Play, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { executeWadahCommand } from "@/lib/electron";

export default function AgentBuilder() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("visual");
  const [creating, setCreating] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [workspacePath] = useState("/Users/hsp/wadah-workspace/agents");
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    security: "minimal",
    template: "",
  });

  // Get template from URL if provided
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const template = params.get('template');
    if (template) {
      setSelectedTemplate(template);
      setFormData(prev => ({ ...prev, template }));
    }
  }, []);

  const handleCreate = async () => {
    if (!formData.name) {
      setResult({
        success: false,
        message: "Please enter an agent name"
      });
      return;
    }

    setCreating(true);
    setResult(null);

    try {
      console.log('Creating agent:', formData);
      
      // Call wadah init
      const response = await executeWadahCommand('init', {
        name: formData.name,
        options: {
          security: formData.security,
          // Note: template option not yet implemented in CLI
          // template: formData.template || undefined,
        }
      });

      console.log('Agent creation response:', response);

      if (response.success) {
        setResult({
          success: true,
          message: response.output || `Agent "${formData.name}" created successfully!`
        });
        
        // Navigate to agents list after 2 seconds
        setTimeout(() => {
          setLocation('/agents');
        }, 2000);
      } else {
        setResult({
          success: false,
          message: response.error || response.output || 'Failed to create agent'
        });
      }
    } catch (error) {
      console.error('Agent creation error:', error);
      setResult({
        success: false,
        message: String(error)
      });
    } finally {
      setCreating(false);
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation('/agents')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create New Agent</h1>
            <p className="text-muted-foreground">
              Initialize a new Wadah agent {selectedTemplate && `from "${selectedTemplate}" template`}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleCreate}
            disabled={creating || !formData.name}
          >
            {creating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
            <Play className="h-4 w-4 mr-2" />
                Create Agent
              </>
            )}
          </Button>
        </div>
      </div>

      {result && (
        <Alert variant={result.success ? "default" : "destructive"}>
          <div className="flex items-start gap-2">
            {result.success ? (
              <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1 space-y-2">
              <AlertDescription>
                {result.success ? (
                  <>
                    <div className="font-semibold text-green-700 dark:text-green-400 mb-2">
                      ✓ Agent created successfully!
                    </div>
                    <pre className="text-xs font-mono bg-muted p-3 rounded overflow-auto max-h-40 whitespace-pre-wrap">
                      {result.message}
                    </pre>
                    <p className="text-xs mt-2 text-muted-foreground">
                      Redirecting to agents list in 2 seconds...
                    </p>
                  </>
                ) : (
                  <div>
                    <div className="font-semibold mb-1">Failed to create agent</div>
                    <pre className="text-xs font-mono bg-destructive/10 p-2 rounded overflow-auto max-h-40 whitespace-pre-wrap">
                      {result.message}
                    </pre>
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
              <Label htmlFor="name">Agent Name *</Label>
                    <Input
                      id="name"
                placeholder="e.g., my-support-bot"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={creating}
                    />
              <p className="text-xs text-muted-foreground">
                Use lowercase with hyphens (e.g., my-agent-name)
              </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="What does this agent do?"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={creating}
                    />
                  </div>

            <div className="space-y-2">
              <Label htmlFor="security">Security Level</Label>
              <Select
                value={formData.security}
                onValueChange={(value) => setFormData({ ...formData, security: value })}
                disabled={creating}
              >
                <SelectTrigger id="security">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minimal">Minimal - No security plugins</SelectItem>
                  <SelectItem value="standard">Standard - Basic security</SelectItem>
                  <SelectItem value="strict">Strict - Maximum security</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Choose security policy for the agent
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="template">Template (Optional)</Label>
              <Select
                value={formData.template || "none"}
                onValueChange={(value) => setFormData({ ...formData, template: value === "none" ? "" : value })}
                disabled={creating}
              >
                <SelectTrigger id="template">
                  <SelectValue placeholder="Start from scratch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No template (blank)</SelectItem>
                  <SelectItem value="hello-world">Hello World</SelectItem>
                  <SelectItem value="langchain-rag">LangChain RAG</SelectItem>
                  <SelectItem value="devops-copilot">DevOps Copilot</SelectItem>
                  <SelectItem value="customer-support">Customer Support</SelectItem>
                </SelectContent>
              </Select>
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
                {`wadah init ${formData.name || '<name>'}${formData.security ? ` --security ${formData.security}` : ''}`}
              </pre>
              {formData.template && (
                <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-2">
                  Note: Template option will be ignored as it's not yet implemented in the CLI
                </p>
              )}
            </div>

                  <div className="space-y-2">
              <Label>Output Location</Label>
              <div className="font-mono text-xs bg-muted p-3 rounded-md">
                {workspacePath}
                  </div>
              <p className="text-xs text-muted-foreground">
                Agent will be created at: <span className="font-semibold">{workspacePath}/{formData.name || '&lt;name&gt;'}</span>
              </p>
              <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mt-2">
                <p className="text-xs text-amber-900 dark:text-amber-300">
                  <span className="font-semibold">ℹ️ Workspace Info:</span> All agents are stored in your home directory's Wadah workspace. 
                  This keeps your agent files separate from the UI source code and makes them easy to backup.
                </p>
                  </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-medium text-sm mb-2">What happens next:</h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>✓ Create project directory</li>
                <li>✓ Generate wadah.yaml manifest</li>
                <li>✓ Add prompts and memory files</li>
                <li>✓ Configure security plugins</li>
                <li>✓ Create README with instructions</li>
              </ul>
            </div>
            </CardContent>
          </Card>
      </div>
    </div>
  );
}
