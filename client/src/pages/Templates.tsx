import { TemplateCard } from "@/components/TemplateCard";
import { SearchBar } from "@/components/SearchBar";
import { EmptyState } from "@/components/EmptyState";
import { useState } from "react";
import { useLocation } from "wouter";
import supportIcon from '@assets/generated_images/Support_chatbot_agent_icon_53b273ce.png';
import ragIcon from '@assets/generated_images/RAG_system_agent_icon_29ac35fc.png';
import devopsIcon from '@assets/generated_images/DevOps_automation_bot_icon_535072b3.png';
import analyticsIcon from '@assets/generated_images/Data_analytics_agent_icon_77101b70.png';

export default function Templates() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const mockTemplates = [
    {
      id: '1',
      name: 'Customer Support Bot',
      description: 'Pre-configured chatbot for handling customer inquiries with natural language understanding',
      image: supportIcon,
      tags: ['chatbot', 'support', 'NLP'],
      rating: 4.8,
      downloads: 1240,
    },
    {
      id: '2',
      name: 'RAG Document QA',
      description: 'Retrieval augmented generation system for document-based question answering',
      image: ragIcon,
      tags: ['RAG', 'documents', 'search'],
      rating: 4.6,
      downloads: 856,
    },
    {
      id: '3',
      name: 'DevOps Assistant',
      description: 'Automated deployment monitoring and incident response bot',
      image: devopsIcon,
      tags: ['DevOps', 'automation', 'monitoring'],
      rating: 4.5,
      downloads: 672,
    },
    {
      id: '4',
      name: 'Data Analytics Agent',
      description: 'Automated data analysis and insights generation from structured datasets',
      image: analyticsIcon,
      tags: ['analytics', 'data', 'insights'],
      rating: 4.7,
      downloads: 423,
    },
  ];

  const filteredTemplates = mockTemplates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Template Library</h1>
        <p className="text-muted-foreground">
          Browse and clone pre-built agent templates to get started quickly
        </p>
      </div>

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
                console.log('Clone template', template.id);
                setLocation('/agents/new');
              }}
              onView={() => setLocation(`/templates/${template.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
