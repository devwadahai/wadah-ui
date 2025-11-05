import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2, XCircle, Terminal, Package, Play, FileCheck, Save, Eye, EyeOff, FolderOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { executeWadahCommand } from "@/lib/electron";

export default function Settings() {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    version?: string;
    error?: string;
  } | null>(null);
  
  const [openaiKey, setOpenaiKey] = useState("");
  const [ollamaUrl, setOllamaUrl] = useState("http://localhost:11434");
  const [showOpenaiKey, setShowOpenaiKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<{ success: boolean; message: string } | null>(null);

  // Load saved environment variables
  useEffect(() => {
    loadEnvVars();
  }, []);

  const loadEnvVars = async () => {
    if (window.wadahAPI) {
      const openai = await window.wadahAPI.getEnv('OPENAI_API_KEY');
      const ollama = await window.wadahAPI.getEnv('OLLAMA_URL');
      
      if (openai) setOpenaiKey(openai);
      if (ollama) setOllamaUrl(ollama);
    }
  };

  const testConnection = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      const result = await executeWadahCommand('version', {});
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        error: String(error)
      });
    } finally {
      setTesting(false);
    }
  };

  const saveApiKeys = async () => {
    setSaving(true);
    setSaveResult(null);

    try {
      if (window.wadahAPI) {
        if (openaiKey) {
          await window.wadahAPI.setEnv('OPENAI_API_KEY', openaiKey);
        }
        if (ollamaUrl) {
          await window.wadahAPI.setEnv('OLLAMA_URL', ollamaUrl);
        }
        
        setSaveResult({
          success: true,
          message: 'API keys saved successfully! They will be used for all agent runs.'
        });
      } else {
        setSaveResult({
          success: false,
          message: 'Not running in Electron mode'
        });
      }
    } catch (error) {
      setSaveResult({
        success: false,
        message: String(error)
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Configure your Wadah Desktop application
        </p>
      </div>

      {/* API Keys */}
      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>
            Configure API keys for AI model providers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {saveResult && (
            <Alert variant={saveResult.success ? "default" : "destructive"}>
              <div className="flex items-start gap-2">
                {saveResult.success ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5" />
                )}
                <AlertDescription>{saveResult.message}</AlertDescription>
              </div>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="openai-key">
              OpenAI API Key
            </Label>
            <div className="flex gap-2">
              <Input
                id="openai-key"
                type={showOpenaiKey ? "text" : "password"}
                placeholder="sk-..."
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowOpenaiKey(!showOpenaiKey)}
              >
                {showOpenaiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Required for running agents with OpenAI models (gpt-4, gpt-3.5-turbo, etc.)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ollama-url">
              Ollama URL (Optional)
            </Label>
            <Input
              id="ollama-url"
              type="text"
              placeholder="http://localhost:11434"
              value={ollamaUrl}
              onChange={(e) => setOllamaUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              For local Ollama models (llama2, mistral, etc.)
            </p>
          </div>

          <Button onClick={saveApiKeys} disabled={saving || !openaiKey}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            Save API Keys
          </Button>
        </CardContent>
      </Card>

      {/* Wadah CLI Connection */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="h-5 w-5" />
                Wadah CLI Connection
              </CardTitle>
              <CardDescription>
                Test connection to the Wadah engine
              </CardDescription>
            </div>
            <Button 
              onClick={testConnection}
              disabled={testing}
              variant="outline"
            >
              {testing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Test Connection
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {testResult && (
            <Alert variant={testResult.success ? "default" : "destructive"}>
              <div className="flex items-start gap-2">
                {testResult.success ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5" />
                )}
                <div className="flex-1">
                  <AlertDescription>
                    {testResult.success ? (
                      <div className="space-y-2">
                        <p className="font-medium text-green-700 dark:text-green-400">
                          ✅ Connected to Wadah CLI
                        </p>
                        {testResult.version && (
                          <p className="text-sm">
                            <strong>Version:</strong> {testResult.version}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="font-medium">❌ Connection Failed</p>
                        <p className="text-sm">{testResult.error}</p>
                        <p className="text-xs mt-2">
                          Make sure wadah CLI is installed and accessible.
                        </p>
                      </div>
                    )}
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">CLI Path</label>
              <code className="block p-2 bg-muted rounded text-xs">
                /Users/hsp/Projects/wadah-engine/target/release/wadah
              </code>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <div>
                {testResult === null ? (
                  <Badge variant="secondary">Not Tested</Badge>
                ) : testResult.success ? (
                  <Badge variant="default" className="bg-green-500">Connected</Badge>
                ) : (
                  <Badge variant="destructive">Disconnected</Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workspace Locations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Workspace Locations
          </CardTitle>
          <CardDescription>
            Where your agents, packages, and traces are stored
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Agents Directory</label>
              <code className="block p-3 bg-muted rounded text-xs font-mono">
                ~/wadah-workspace/agents/
              </code>
              <p className="text-xs text-muted-foreground">
                All your agent source code and configurations
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Packages Directory</label>
              <code className="block p-3 bg-muted rounded text-xs font-mono">
                ~/wadah-workspace/packages/
              </code>
              <p className="text-xs text-muted-foreground">
                Built .wpkg packages ready for distribution
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Environment Config</label>
              <code className="block p-3 bg-muted rounded text-xs font-mono">
                ~/Library/Application Support/wadah-desktop/env-config.json
              </code>
              <p className="text-xs text-muted-foreground">
                Stored API keys and environment variables
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-xs text-blue-900 dark:text-blue-300">
                <span className="font-semibold">💡 Tip:</span> These locations are in your home directory, 
                separate from the UI source code. This makes backups easier and keeps your agents portable.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Operations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Available Operations
          </CardTitle>
          <CardDescription>
            Wadah CLI commands available through the desktop app
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { icon: Package, name: 'wadah init', desc: 'Create new agent' },
              { icon: Package, name: 'wadah pack', desc: 'Package agent' },
              { icon: Play, name: 'wadah run', desc: 'Execute agent' },
              { icon: FileCheck, name: 'wadah verify', desc: 'Verify package' },
              { icon: Terminal, name: 'wadah trace', desc: 'View traces' },
              { icon: Package, name: 'wadah plugins', desc: 'List plugins' },
            ].map((cmd, i) => (
              <div key={i} className="flex items-start gap-3 p-3 border rounded-lg">
                <cmd.icon className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <code className="text-sm font-mono">{cmd.name}</code>
                  <p className="text-xs text-muted-foreground mt-1">{cmd.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
