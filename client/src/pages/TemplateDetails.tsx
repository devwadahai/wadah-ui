import { useParams, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Rocket, Download, Star, Clock, GitFork } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function TemplateDetails() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const templateId = params.id;

  const mockTemplate = {
    id: templateId,
    name: 'RAG Document QA',
    description: 'Production-ready RAG system with vector embeddings for document question answering',
    category: 'RAG',
    icon: '📚',
    downloads: 1247,
    stars: 342,
    forks: 89,
    lastUpdated: '2024-11-01',
    version: '1.2.0',
    author: 'Wadah Team',
    tags: ['RAG', 'Documents', 'Embeddings', 'Production'],
    readme: `# RAG Document QA Template

A production-ready Retrieval-Augmented Generation (RAG) system for document question answering.

## Features

- Vector embedding generation using OpenAI
- Document chunking and indexing
- Semantic search across documents
- Context-aware answer generation
- Support for multiple document formats (PDF, TXT, MD)

## Requirements

- OpenAI API Key
- Vector database (Pinecone or local)
- Minimum 2GB RAM

## Quick Start

1. Configure your OpenAI API key
2. Upload your documents
3. Index the documents
4. Start asking questions

## Configuration

\`\`\`json
{
  "model": "gpt-4",
  "embedding_model": "text-embedding-ada-002",
  "chunk_size": 1000,
  "chunk_overlap": 200
}
\`\`\`

## Use Cases

- Internal knowledge base
- Customer support documentation
- Research paper analysis
- Legal document review`,
    environment: {
      OPENAI_API_KEY: 'required',
      VECTOR_DB_URL: 'optional',
      CHUNK_SIZE: '1000',
      MODEL: 'gpt-4',
    },
    dependencies: [
      'openai@1.0.0',
      'langchain@0.1.0',
      'chromadb@0.4.0',
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLocation('/templates')}
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{mockTemplate.icon}</span>
            <h1 className="text-3xl font-bold" data-testid="text-template-name">
              {mockTemplate.name}
            </h1>
          </div>
          <p className="text-muted-foreground">
            {mockTemplate.description}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" data-testid="button-download">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button onClick={() => setLocation('/agents/new')} data-testid="button-use-template">
            <Rocket className="h-4 w-4 mr-2" />
            Use Template
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Star className="h-4 w-4" />
          {mockTemplate.stars} stars
        </span>
        <span className="flex items-center gap-1.5">
          <GitFork className="h-4 w-4" />
          {mockTemplate.forks} forks
        </span>
        <span className="flex items-center gap-1.5">
          <Download className="h-4 w-4" />
          {mockTemplate.downloads} uses
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          Updated {mockTemplate.lastUpdated}
        </span>
        <span>v{mockTemplate.version}</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {mockTemplate.tags.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>

      <Separator />

      <Tabs defaultValue="readme" className="w-full">
        <TabsList>
          <TabsTrigger value="readme" data-testid="tab-readme">README</TabsTrigger>
          <TabsTrigger value="config" data-testid="tab-config">Configuration</TabsTrigger>
          <TabsTrigger value="dependencies" data-testid="tab-dependencies">Dependencies</TabsTrigger>
        </TabsList>

        <TabsContent value="readme" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-sm">
                  {mockTemplate.readme}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Environment Variables</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(mockTemplate.environment).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-mono text-sm font-medium">{key}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {value === 'required' ? 'Required' : `Default: ${value}`}
                      </p>
                    </div>
                    <Badge variant={value === 'required' ? 'default' : 'secondary'}>
                      {value === 'required' ? 'Required' : 'Optional'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dependencies" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Package Dependencies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockTemplate.dependencies.map((dep) => (
                  <div
                    key={dep}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <code className="text-sm font-mono">{dep}</code>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Author</span>
            <span className="text-sm font-medium">{mockTemplate.author}</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Category</span>
            <Badge variant="secondary">{mockTemplate.category}</Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">License</span>
            <span className="text-sm font-medium">MIT</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
