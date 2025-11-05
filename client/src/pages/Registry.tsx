import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Package, Download, Upload, ExternalLink, Loader2, CheckCircle2, XCircle, FileArchive } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";

interface LocalPackage {
  name: string;
  filename: string;
  path: string;
  size: number;
  created: string;
  modified: string;
}

interface Agent {
  name: string;
  path: string;
  hasManifest: boolean;
}

export default function Registry() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [packages, setPackages] = useState<LocalPackage[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Package creation dialog
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState("");
  const [packaging, setPackaging] = useState(false);
  const [packResult, setPackResult] = useState<{ success: boolean; message: string } | null>(null);

  // Push to registry dialog
  const [showPushDialog, setShowPushDialog] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<LocalPackage | null>(null);
  const [pushData, setPushData] = useState({
    registry: 'ghcr.io',
    repository: '',
    tag: 'latest',
  });
  const [pushing, setPushing] = useState(false);
  const [pushResult, setPushResult] = useState<{ success: boolean; message: string } | null>(null);

  // Pull from registry dialog
  const [showPullDialog, setShowPullDialog] = useState(false);
  const [pullImageName, setPullImageName] = useState('');
  const [pulling, setPulling] = useState(false);
  const [pullResult, setPullResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    loadPackages();
    loadAgents();
  }, []);

  const loadPackages = async () => {
    setLoading(true);
    try {
      if (window.wadahAPI) {
        const result = await window.wadahAPI.listPackages();
        if (result.success && result.packages) {
          setPackages(result.packages);
        }
      }
    } catch (error) {
      console.error('Failed to load packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAgents = async () => {
    try {
      if (window.wadahAPI) {
        const result = await window.wadahAPI.listAgents();
        if (result.success && result.agents) {
          setAgents(result.agents);
        }
      }
    } catch (error) {
      console.error('Failed to load agents:', error);
    }
  };

  const handleCreatePackage = async () => {
    if (!selectedAgent) return;

    setPackaging(true);
    setPackResult(null);

    try {
      if (window.wadahAPI) {
        const agent = agents.find(a => a.name === selectedAgent);
        if (!agent) {
          setPackResult({ success: false, message: 'Agent not found' });
          return;
        }

        const manifestPath = `${agent.path}/wadah.yaml`;
        const outputPath = `/Users/hsp/wadah-workspace/packages/${selectedAgent}.wpkg`;

        const result = await window.wadahAPI.packAgent(manifestPath, {
          output: outputPath
        });

        if (result.success) {
          setPackResult({
            success: true,
            message: `Package created successfully at ${outputPath}`
          });
          // Reload packages list
          setTimeout(() => {
            loadPackages();
            setShowCreateDialog(false);
            setSelectedAgent("");
            setPackResult(null);
          }, 2000);
        } else {
          setPackResult({
            success: false,
            message: result.error || 'Failed to create package'
          });
        }
      }
    } catch (error) {
      setPackResult({
        success: false,
        message: String(error)
      });
    } finally {
      setPackaging(false);
    }
  };

  const handlePushToRegistry = async () => {
    if (!selectedPackage) return;
    if (!pushData.repository) {
      setPushResult({ success: false, message: 'Please enter a repository name' });
      return;
    }

    setPushing(true);
    setPushResult(null);

    try {
      if (window.wadahAPI) {
        // OCI references must be lowercase
        const repository = pushData.repository.toLowerCase();
        const tag = pushData.tag.toLowerCase();
        const fullImageName = `${pushData.registry}/${repository}:${tag}`;
        
        setPushResult({ 
          success: true, 
          message: `📤 Pushing to ${fullImageName}...\n\nThis may take a moment...` 
        });
        
        // Push to registry
        const pushResult = await window.wadahAPI.pushPackage(fullImageName, selectedPackage.path);
        
            if (pushResult.success) {
              setPushResult({
                success: true,
                message: `✅ Successfully pushed to registry!\n\nImage: ${fullImageName}\n\n${pushResult.output || ''}\n\nYou can now pull this package from any machine with:\n  wadah pull ${fullImageName}`
              });
              
              // Close dialog after 3 seconds on success
              setTimeout(() => {
                setShowPushDialog(false);
                setPushResult(null);
              }, 3000);
            } else {
              setPushResult({
                success: false,
                message: `❌ Push failed:\n\n${pushResult.error || pushResult.output}\n\nTip: Make sure you're authenticated to the registry:\n  docker login ${pushData.registry}`
              });
            }
      }
    } catch (error) {
      setPushResult({
        success: false,
        message: String(error)
      });
    } finally {
      setPushing(false);
    }
  };

  const handlePullFromRegistry = async () => {
    if (!pullImageName) {
      setPullResult({ success: false, message: 'Please enter an image name' });
      return;
    }

    setPulling(true);
    setPullResult(null);

    try {
      if (window.wadahAPI) {
        setPullResult({ 
          success: true, 
          message: `📥 Pulling ${pullImageName}...\n\nThis may take a moment...` 
        });
        
        const result = await window.wadahAPI.pullPackage(pullImageName);
        
        if (result.success) {
          setPullResult({
            success: true,
            message: `✅ Successfully pulled from registry!\n\nImage: ${pullImageName}\n\n${result.output || ''}\n\nThe package is now available in your local packages.`
          });
          
          // Reload packages and close dialog after 3 seconds
          setTimeout(() => {
            loadPackages();
            setShowPullDialog(false);
            setPullResult(null);
            setPullImageName('');
          }, 3000);
        } else {
          setPullResult({
            success: false,
            message: `❌ Pull failed:\n\n${result.error || result.output}\n\nMake sure the image name is correct and you have access to the registry.`
          });
        }
      }
    } catch (error) {
      setPullResult({
        success: false,
        message: String(error)
      });
    } finally {
      setPulling(false);
    }
  };

  const openPushDialog = (pkg: LocalPackage) => {
    setSelectedPackage(pkg);
    setPushData({
      registry: 'ghcr.io',
      repository: `devwadahai/${pkg.name}`, // Use actual username
      tag: 'latest',
    });
    setPushResult(null);
    setShowPushDialog(true);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const filteredPackages = packages.filter(pkg =>
    pkg.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Package Registry</h1>
          <p className="text-muted-foreground">
            Manage your agent packages (.wpkg files)
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowPullDialog(true)}>
            <Download className="h-4 w-4 mr-2" />
            Pull from Registry
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}>
          <Upload className="h-4 w-4 mr-2" />
            Create Package
        </Button>
        </div>
      </div>

      {/* Package Creation Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Create Agent Package</DialogTitle>
            <DialogDescription>
              Package an agent into a distributable .wpkg file
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 overflow-y-auto flex-1 pr-2">
            {packResult && (
              <Alert variant={packResult.success ? "default" : "destructive"}>
                <div className="flex items-start gap-2">
                  {packResult.success ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  )}
                  <AlertDescription className="text-xs break-words">
                    {packResult.message}
                  </AlertDescription>
                </div>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="agent">Select Agent</Label>
              <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                <SelectTrigger id="agent">
                  <SelectValue placeholder="Choose an agent to package" />
                </SelectTrigger>
                <SelectContent>
                  {agents.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No agents found
                    </SelectItem>
                  ) : (
                    agents.map((agent) => (
                      <SelectItem key={agent.name} value={agent.name}>
                        {agent.name} {!agent.hasManifest && '(no manifest)'}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Only agents with wadah.yaml can be packaged
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-medium text-sm mb-2">Package will include:</h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>✓ wadah.yaml manifest</li>
                <li>✓ Prompts and memory files</li>
                <li>✓ Security configurations</li>
                <li>✓ All agent assets</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreatePackage} 
              disabled={packaging || !selectedAgent}
            >
              {packaging && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <FileArchive className="mr-2 h-4 w-4" />
              Create Package
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Push to Registry Dialog */}
      <Dialog open={showPushDialog} onOpenChange={(open) => {
        setShowPushDialog(open);
        if (!open) {
          // Reset state when closing
          setPushResult(null);
        }
      }}>
        <DialogContent className="max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Push to Registry</DialogTitle>
            <DialogDescription>
              Push {selectedPackage?.name} to an OCI registry
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 overflow-y-auto flex-1 pr-2">
            {pushResult && (
              <Alert variant={pushResult.success ? "default" : "destructive"}>
                <div className="flex items-start gap-2">
                  {pushResult.success ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  )}
                  <AlertDescription className="whitespace-pre-wrap text-xs break-words">
                    {pushResult.message}
                  </AlertDescription>
                </div>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="registry">Registry</Label>
              <Select value={pushData.registry} onValueChange={(v) => setPushData({...pushData, registry: v})}>
                <SelectTrigger id="registry">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ghcr.io">GitHub Container Registry (ghcr.io)</SelectItem>
                  <SelectItem value="docker.io">Docker Hub (docker.io)</SelectItem>
                  <SelectItem value="custom">Custom Registry</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="repository">Repository</Label>
              <Input
                id="repository"
                placeholder="username/repository-name"
                value={pushData.repository}
                onChange={(e) => setPushData({...pushData, repository: e.target.value})}
              />
              <p className="text-xs text-muted-foreground">
                Format: username/repository or org/repository (will be converted to lowercase)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tag">Tag</Label>
              <Input
                id="tag"
                placeholder="latest"
                value={pushData.tag}
                onChange={(e) => setPushData({...pushData, tag: e.target.value})}
              />
              <p className="text-xs text-muted-foreground">
                Examples: latest, v1.0, staging
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-medium text-sm mb-2">Full image name:</h4>
              <code className="text-xs break-all">
                {pushData.registry}/{pushData.repository.toLowerCase()}:{pushData.tag.toLowerCase()}
              </code>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <h4 className="font-medium text-sm mb-2">⚠️ Authentication Required</h4>
              <p className="text-xs text-muted-foreground">
                You'll need to be logged in to the registry. Run in terminal:
              </p>
              <code className="block text-xs mt-2 p-2 bg-black/5 dark:bg-white/5 rounded">
                docker login {pushData.registry}
              </code>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPushDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handlePushToRegistry} 
              disabled={pushing || !pushData.repository}
            >
              {pushing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Upload className="mr-2 h-4 w-4" />
              Push to Registry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pull from Registry Dialog */}
      <Dialog open={showPullDialog} onOpenChange={setShowPullDialog}>
        <DialogContent className="max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Pull from Registry</DialogTitle>
            <DialogDescription>
              Pull a package from an OCI registry
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 overflow-y-auto flex-1 pr-2">
            {pullResult && (
              <Alert variant={pullResult.success ? "default" : "destructive"}>
                <div className="flex items-start gap-2">
                  {pullResult.success ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  )}
                  <AlertDescription className="whitespace-pre-wrap text-xs break-words">
                    {pullResult.message}
                  </AlertDescription>
                </div>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="pullImageName">Image Name</Label>
              <Input
                id="pullImageName"
                placeholder="registry/repository:tag"
                value={pullImageName}
                onChange={(e) => setPullImageName(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Full OCI image name including registry, repository, and tag
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-medium text-sm mb-2">Examples:</h4>
              <div className="space-y-1">
                <code className="block text-xs">ghcr.io/username/my-agent:latest</code>
                <code className="block text-xs">docker.io/myorg/support-bot:v1.0</code>
                <code className="block text-xs">myregistry.io/team/agent:prod</code>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <h4 className="font-medium text-sm mb-2">⚠️ Authentication</h4>
              <p className="text-xs text-muted-foreground">
                For private registries, you'll need to be logged in. Run in terminal:
              </p>
              <code className="block text-xs mt-2 p-2 bg-black/5 dark:bg-white/5 rounded">
                docker login &lt;registry&gt;
              </code>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowPullDialog(false);
              setPullResult(null);
              setPullImageName('');
            }}>
              Cancel
            </Button>
            <Button 
              onClick={handlePullFromRegistry} 
              disabled={pulling || !pullImageName}
            >
              {pulling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Download className="mr-2 h-4 w-4" />
              Pull Package
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <SearchBar
        placeholder="Search packages..."
        value={searchQuery}
        onChange={setSearchQuery}
      />

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading packages...</p>
          </div>
        </div>
      ) : filteredPackages.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Packages Yet</h3>
            <p className="text-sm text-muted-foreground mb-4 text-center">
              Create your first package by clicking "Create Package" above
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Create Your First Package
            </Button>
          </CardContent>
        </Card>
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredPackages.map((pkg) => (
          <Card
              key={pkg.filename}
            className="cursor-pointer hover-elevate"
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                      <CardTitle className="text-base truncate">
                      {pkg.name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                        {pkg.filename}
                    </p>
                  </div>
                </div>
                  <Badge variant="secondary" className="flex-shrink-0">
                    .wpkg
                  </Badge>
              </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Size:</span>
                    <span className="font-mono">{formatBytes(pkg.size)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created:</span>
                    <span>{formatDate(pkg.created)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Modified:</span>
                    <span>{formatDate(pkg.modified)}</span>
                  </div>
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t pt-4">
                <code className="text-xs text-muted-foreground truncate max-w-[120px]">
                  {pkg.path}
                </code>
                <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      openPushDialog(pkg);
                    }}
              >
                    <Upload className="h-3 w-3 mr-1.5" />
                    Push
                  </Button>
                  <Button variant="outline" size="sm">
                <Download className="h-3 w-3 mr-1.5" />
                    Run
              </Button>
                </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      )}

      {/* Registry Info */}
      <Card>
        <CardHeader>
          <CardTitle>About Package Registry</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Wadah packages (.wpkg) are OCI-compliant containers that can be stored, 
            shared, and deployed across environments. They contain everything needed to run an agent.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 border rounded-lg">
              <p className="font-medium text-sm mb-1">Local Registry</p>
              <p className="text-xs text-muted-foreground">
                ~/wadah-workspace/packages/
              </p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="font-medium text-sm mb-1">Package Format</p>
              <p className="text-xs text-muted-foreground">
                OCI-compliant .wpkg files
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
