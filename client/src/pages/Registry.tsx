import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Download, Upload, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

interface RegistryPackage {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  downloads: number;
  size: string;
  published: string;
  tags: string[];
}

export default function Registry() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const mockPackages: RegistryPackage[] = [
    {
      id: '1',
      name: 'wadah/support-chatbot',
      version: '1.0.0',
      description: 'Production-ready customer support chatbot with NLP capabilities',
      author: 'Wadah Team',
      downloads: 1247,
      size: '45 MB',
      published: '2 weeks ago',
      tags: ['chatbot', 'support', 'production'],
    },
    {
      id: '2',
      name: 'wadah/rag-service',
      version: '0.3.2',
      description: 'RAG-based document QA system with vector embeddings',
      author: 'Wadah Team',
      downloads: 856,
      size: '62 MB',
      published: '5 days ago',
      tags: ['RAG', 'documents', 'embeddings'],
    },
    {
      id: '3',
      name: 'community/devops-assistant',
      version: '0.2.1',
      description: 'DevOps automation and monitoring agent',
      author: 'Community',
      downloads: 423,
      size: '38 MB',
      published: '1 week ago',
      tags: ['DevOps', 'automation', 'monitoring'],
    },
    {
      id: '4',
      name: 'wadah/data-analyzer',
      version: '1.1.0',
      description: 'Automated data analysis with insights generation',
      author: 'Wadah Team',
      downloads: 672,
      size: '51 MB',
      published: '3 weeks ago',
      tags: ['analytics', 'data', 'insights'],
    },
  ];

  const filteredPackages = mockPackages.filter(pkg =>
    pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pkg.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pkg.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Registry</h1>
          <p className="text-muted-foreground">
            Browse and manage agent packages
          </p>
        </div>
        <Button data-testid="button-publish">
          <Upload className="h-4 w-4 mr-2" />
          Publish Package
        </Button>
      </div>

      <SearchBar
        placeholder="Search packages..."
        value={searchQuery}
        onChange={setSearchQuery}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredPackages.map((pkg) => (
          <Card
            key={pkg.id}
            data-testid={`card-package-${pkg.id}`}
            className="cursor-pointer hover-elevate"
            onClick={() => setLocation(`/registry/${pkg.id}`)}
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base truncate" data-testid={`text-package-name-${pkg.id}`}>
                      {pkg.name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      v{pkg.version} • {pkg.author}
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                {pkg.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {pkg.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t pt-4">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>{pkg.downloads.toLocaleString()} pulls</span>
                <span>•</span>
                <span>{pkg.size}</span>
                <span>•</span>
                <span>{pkg.published}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                data-testid={`button-pull-${pkg.id}`}
              >
                <Download className="h-3 w-3 mr-1.5" />
                Pull
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registry Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium">Default Registry</p>
              <p className="text-sm text-muted-foreground">ghcr.io/wadah</p>
            </div>
            <Button variant="ghost" size="sm">
              <ExternalLink className="h-4 w-4 mr-1.5" />
              Configure
            </Button>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium">Authentication</p>
              <p className="text-sm text-muted-foreground">OAuth token configured</p>
            </div>
            <Button variant="ghost" size="sm">
              <ExternalLink className="h-4 w-4 mr-1.5" />
              Manage
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
