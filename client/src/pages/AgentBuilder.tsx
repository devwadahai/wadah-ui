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
import { ArrowLeft, Save, Play } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

export default function AgentBuilder() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("visual");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    model: "",
    systemPrompt: "",
  });

  const yamlPreview = `name: ${formData.name || "my-agent"}
version: 0.1.0
description: ${formData.description || "My AI agent"}

runtime:
  model: ${formData.model || "gpt-4"}
  
config:
  system_prompt: |
    ${formData.systemPrompt || "You are a helpful AI assistant."}`;

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
          <div>
            <h1 className="text-3xl font-bold">Create Agent</h1>
            <p className="text-muted-foreground">
              Build a new AI agent with visual tools or YAML
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" data-testid="button-save">
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button data-testid="button-deploy">
            <Play className="h-4 w-4 mr-2" />
            Deploy
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="visual" data-testid="tab-visual">Visual Editor</TabsTrigger>
          <TabsTrigger value="yaml" data-testid="tab-yaml">YAML Editor</TabsTrigger>
        </TabsList>

        <TabsContent value="visual" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Agent Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Customer Support Bot"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      data-testid="input-agent-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="What does this agent do?"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      data-testid="input-description"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Model Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="model">Language Model</Label>
                    <Select
                      value={formData.model}
                      onValueChange={(value) => setFormData({ ...formData, model: value })}
                    >
                      <SelectTrigger id="model" data-testid="select-model">
                        <SelectValue placeholder="Select a model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4">GPT-4</SelectItem>
                        <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                        <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                        <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="systemPrompt">System Prompt</Label>
                    <Textarea
                      id="systemPrompt"
                      placeholder="You are a helpful assistant..."
                      className="font-mono text-sm min-h-32"
                      value={formData.systemPrompt}
                      onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
                      data-testid="input-system-prompt"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>YAML Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs font-mono bg-muted p-4 rounded-md overflow-auto max-h-96">
                    {yamlPreview}
                  </pre>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="yaml">
          <Card>
            <CardContent className="p-0">
              <Textarea
                className="font-mono text-sm min-h-[600px] border-0 rounded-none"
                placeholder="Enter YAML configuration..."
                defaultValue={yamlPreview}
                data-testid="input-yaml"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
