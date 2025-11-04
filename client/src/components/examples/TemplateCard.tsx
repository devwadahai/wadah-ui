import { TemplateCard } from '../TemplateCard'
import supportIcon from '@assets/generated_images/Support_chatbot_agent_icon_53b273ce.png'
import ragIcon from '@assets/generated_images/RAG_system_agent_icon_29ac35fc.png'
import analyticsIcon from '@assets/generated_images/Data_analytics_agent_icon_77101b70.png'

export default function TemplateCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl">
      <TemplateCard
        id="1"
        name="Customer Support Bot"
        description="Pre-configured chatbot for handling customer inquiries with natural language understanding"
        image={supportIcon}
        tags={['chatbot', 'support', 'NLP']}
        rating={4.8}
        downloads={1240}
        onClone={() => console.log('Clone template')}
        onView={() => console.log('View template')}
      />
      <TemplateCard
        id="2"
        name="RAG Document QA"
        description="Retrieval augmented generation system for document-based question answering"
        image={ragIcon}
        tags={['RAG', 'documents', 'search']}
        rating={4.6}
        downloads={856}
        onClone={() => console.log('Clone template')}
      />
      <TemplateCard
        id="3"
        name="Data Analytics Agent"
        description="Automated data analysis and insights generation from structured datasets"
        image={analyticsIcon}
        tags={['analytics', 'data', 'insights']}
        downloads={423}
        onClone={() => console.log('Clone template')}
      />
    </div>
  )
}
