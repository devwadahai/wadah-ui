import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export default function Settings() {
  const [showKey, setShowKey] = useState(false);

  const mockApiKeys = [
    { id: '1', name: 'OpenAI Production', provider: 'OpenAI', lastUsed: '2 hours ago' },
    { id: '2', name: 'Anthropic Dev', provider: 'Anthropic', lastUsed: '1 day ago' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and application preferences
        </p>
      </div>

      <Tabs defaultValue="api-keys">
        <TabsList>
          <TabsTrigger value="api-keys" data-testid="tab-api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="models" data-testid="tab-models">Models</TabsTrigger>
          <TabsTrigger value="general" data-testid="tab-general">General</TabsTrigger>
        </TabsList>

        <TabsContent value="api-keys" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>API Keys</CardTitle>
                  <CardDescription>
                    Manage your AI provider API keys securely
                  </CardDescription>
                </div>
                <Button data-testid="button-add-key">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Key
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockApiKeys.map((key) => (
                  <div
                    key={key.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                    data-testid={`key-item-${key.id}`}
                  >
                    <div className="flex-1">
                      <p className="font-medium">{key.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {key.provider} • Last used {key.lastUsed}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => console.log('Delete key', key.id)}
                      data-testid={`button-delete-${key.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Default Models</CardTitle>
              <CardDescription>
                Configure default language models for your agents
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="default-model">Default Model</Label>
                <Input
                  id="default-model"
                  defaultValue="gpt-4"
                  data-testid="input-default-model"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fallback-model">Fallback Model</Label>
                <Input
                  id="fallback-model"
                  defaultValue="gpt-3.5-turbo"
                  data-testid="input-fallback-model"
                />
              </div>
              <Button data-testid="button-save-models">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure general application preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="workspace-name">Workspace Name</Label>
                <Input
                  id="workspace-name"
                  defaultValue="My Workspace"
                  data-testid="input-workspace-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notification-email">Notification Email</Label>
                <Input
                  id="notification-email"
                  type="email"
                  placeholder="you@example.com"
                  data-testid="input-email"
                />
              </div>
              <Button data-testid="button-save-general">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
