import { useParams, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Download, Package, Clock, Calendar, Code } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function RegistryDetails() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const packageId = params.packageId;

  const mockPackage = {
    id: packageId,
    name: 'wadah/rag-service',
    version: '0.3.2',
    description: 'RAG-based document QA system with vector embeddings',
    author: 'Wadah Team',
    downloads: 856,
    size: '62 MB',
    published: '2024-10-29',
    tags: ['RAG', 'documents', 'embeddings'],
    readme: `# RAG Service

A containerized RAG-based document QA system.

## Installation

\`\`\`bash
wadah pull wadah/rag-service:0.3.2
\`\`\`

## Usage

\`\`\`bash
wadah run wadah/rag-service:0.3.2
\`\`\`

## Environment Variables

- \`OPENAI_API_KEY\` - Your OpenAI API key
- \`VECTOR_DB_URL\` - Vector database connection string

## Features

- Automatic document chunking
- Vector embedding generation
- Semantic search
- Context-aware responses`,
    versions: [
      { version: '0.3.2', published: '2024-10-29', size: '62 MB' },
      { version: '0.3.1', published: '2024-10-15', size: '61 MB' },
      { version: '0.3.0', published: '2024-10-01', size: '60 MB' },
      { version: '0.2.1', published: '2024-09-20', size: '58 MB' },
    ],
    dockerfile: `FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8080

CMD ["python", "main.py"]`,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLocation('/registry')}
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-3xl font-bold" data-testid="text-package-name">
              {mockPackage.name}
            </h1>
          </div>
          <p className="text-muted-foreground">
            {mockPackage.description}
          </p>
        </div>
        <Button data-testid="button-pull">
          <Download className="h-4 w-4 mr-2" />
          Pull
        </Button>
      </div>

      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Download className="h-4 w-4" />
          {mockPackage.downloads.toLocaleString()} pulls
        </span>
        <span className="flex items-center gap-1.5">
          <Package className="h-4 w-4" />
          {mockPackage.size}
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4" />
          Published {mockPackage.published}
        </span>
        <span>v{mockPackage.version}</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {mockPackage.tags.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>

      <Separator />

      <Tabs defaultValue="readme" className="w-full">
        <TabsList>
          <TabsTrigger value="readme" data-testid="tab-readme">README</TabsTrigger>
          <TabsTrigger value="versions" data-testid="tab-versions">Versions</TabsTrigger>
          <TabsTrigger value="dockerfile" data-testid="tab-dockerfile">Dockerfile</TabsTrigger>
        </TabsList>

        <TabsContent value="readme" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-sm">
                  {mockPackage.readme}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="versions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Versions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockPackage.versions.map((ver, idx) => (
                  <div
                    key={ver.version}
                    className="flex items-center justify-between p-3 border rounded-lg"
                    data-testid={`version-${ver.version}`}
                  >
                    <div className="flex items-center gap-3">
                      <code className="text-sm font-mono font-medium">
                        v{ver.version}
                      </code>
                      {idx === 0 && (
                        <Badge variant="default">Latest</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {ver.published}
                      </span>
                      <span>{ver.size}</span>
                      <Button variant="ghost" size="sm">
                        <Download className="h-3 w-3 mr-1.5" />
                        Pull
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dockerfile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                Dockerfile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
                <code className="text-sm font-mono">
                  {mockPackage.dockerfile}
                </code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Package Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Author</span>
            <span className="text-sm font-medium">{mockPackage.author}</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Registry</span>
            <code className="text-sm">ghcr.io/wadah</code>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Pull Command</span>
            <code className="text-sm">
              wadah pull {mockPackage.name}:{mockPackage.version}
            </code>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
