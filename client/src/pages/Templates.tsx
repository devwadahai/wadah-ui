import { TemplateCard } from "@/components/TemplateCard";
import { SearchBar } from "@/components/SearchBar";
import { EmptyState } from "@/components/EmptyState";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import { executeWadahCommand } from "@/lib/electron";
import supportIcon from '@assets/generated_images/Support_chatbot_agent_icon_53b273ce.png';
import ragIcon from '@assets/generated_images/RAG_system_agent_icon_29ac35fc.png';
import devopsIcon from '@assets/generated_images/DevOps_automation_bot_icon_535072b3.png';
import analyticsIcon from '@assets/generated_images/Data_analytics_agent_icon_77101b70.png';

interface Template {
  id: string;
  name: string;
  description: string;
  image: string;
  tags: string[];
  rating: number;
  downloads: number;
}

// Map template names to icons
const iconMap: Record<string, string> = {
  'customer-support': supportIcon,
  'langchain-rag': ragIcon,
  'devops-copilot': devopsIcon,
  'hello-world': analyticsIcon,
  'rag-service': ragIcon,
  'defi-risk-watcher': analyticsIcon,
};

// Map template names to friendly names
const nameMap: Record<string, string> = {
  'customer-support': 'Customer Support Bot',
  'langchain-rag': 'RAG Document QA',
  'devops-copilot': 'DevOps Copilot',
  'hello-world': 'Hello World',
  'rag-service': 'RAG Service',
  'defi-risk-watcher': 'DeFi Risk Watcher',
};

// Map template names to descriptions
const descMap: Record<string, string> = {
  'customer-support': 'Pre-configured chatbot for handling customer inquiries with natural language understanding',
  'langchain-rag': 'LangChain-based RAG system with TGI, Qdrant, and production-ready deployment',
  'devops-copilot': 'Kubernetes operations and GitHub CI/CD automation with strict security',
  'hello-world': 'Minimal template to get started with Wadah agents',
  'rag-service': 'Retrieval augmented generation system for document-based question answering',
  'defi-risk-watcher': 'DeFi protocol risk monitoring and alerting system',
};

// Map template names to tags
const tagsMap: Record<string, string[]> = {
  'customer-support': ['chatbot', 'support', 'NLP'],
  'langchain-rag': ['RAG', 'LangChain', 'production'],
  'devops-copilot': ['DevOps', 'K8s', 'automation'],
  'hello-world': ['starter', 'minimal', 'tutorial'],
  'rag-service': ['RAG', 'documents', 'search'],
  'defi-risk-watcher': ['DeFi', 'monitoring', 'crypto'],
};

export default function Templates() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setLoading(true);
    setError(null);

    try {
      let data;
      
      // Try Electron API first
      if (window.wadahAPI) {
        data = await window.wadahAPI.getTemplates();
      } else {
        // Fallback to web API
        const response = await fetch('/api/wadah/templates');
        data = await response.json();
      }

      if (data.success && data.templates) {
        // Convert to UI format
        const loadedTemplates: Template[] = data.templates.map((t: any, index: number) => ({
          id: t.name,
          name: nameMap[t.name] || t.name.split('-').map((w: string) => 
            w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
          description: descMap[t.name] || t.description || `Template for ${t.name}`,
          image: iconMap[t.name] || analyticsIcon,
          tags: tagsMap[t.name] || ['agent', 'template'],
          rating: 4.5 + (index * 0.1),
          downloads: 1000 - (index * 100),
        }));

        setTemplates(loadedTemplates);
      } else {
        throw new Error(data.error || 'Failed to load templates');
      }
    } catch (err) {
      console.error('Failed to load templates:', err);
      setError(String(err));
      
      // Fallback to mock data
      setTemplates([
        {
          id: 'customer-support',
          name: 'Customer Support Bot',
          description: 'Pre-configured chatbot for handling customer inquiries',
          image: supportIcon,
          tags: ['chatbot', 'support', 'NLP'],
          rating: 4.8,
          downloads: 1240,
        },
        {
          id: 'langchain-rag',
          name: 'RAG Document QA',
          description: 'LangChain-based RAG system with production deployment',
          image: ragIcon,
          tags: ['RAG', 'LangChain', 'production'],
          rating: 4.6,
          downloads: 856,
        },
        {
          id: 'devops-copilot',
          name: 'DevOps Copilot',
          description: 'Kubernetes and CI/CD automation assistant',
          image: devopsIcon,
          tags: ['DevOps', 'K8s', 'automation'],
          rating: 4.5,
          downloads: 672,
        },
        {
          id: 'hello-world',
          name: 'Hello World',
          description: 'Minimal starter template for Wadah agents',
          image: analyticsIcon,
          tags: ['starter', 'minimal', 'tutorial'],
          rating: 4.7,
          downloads: 423,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Template Library</h1>
        <p className="text-muted-foreground">
          Browse and use pre-built agent templates from wadah-engine
        </p>
      </div>

      {error && (
        <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            ⚠️ Could not load templates from wadah-engine. Showing cached templates.
          </p>
          <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
            Make sure wadah-engine is accessible at: /Users/hsp/Projects/wadah-engine/templates
          </p>
        </div>
      )}

      <SearchBar
        placeholder="Search templates..."
        value={searchQuery}
        onChange={setSearchQuery}
      />

      {filteredTemplates.length === 0 ? (
        <EmptyState
          title="No templates found"
          description="Try adjusting your search terms"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              {...template}
              onClone={() => {
                // Navigate to agent builder with template
                setLocation(`/agents/new?template=${template.id}`);
              }}
              onView={() => setLocation(`/templates/${template.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
