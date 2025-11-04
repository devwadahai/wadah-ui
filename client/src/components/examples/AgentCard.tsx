import { AgentCard } from '../AgentCard'
import supportIcon from '@assets/generated_images/Support_chatbot_agent_icon_53b273ce.png'
import ragIcon from '@assets/generated_images/RAG_system_agent_icon_29ac35fc.png'
import devopsIcon from '@assets/generated_images/DevOps_automation_bot_icon_535072b3.png'

export default function AgentCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl">
      <AgentCard
        id="1"
        name="Support Chatbot"
        version="1.0.0"
        status="running"
        runCount={1247}
        image={supportIcon}
        description="Handles customer support inquiries with AI-powered responses"
        onView={() => console.log('View agent')}
        onStart={() => console.log('Start agent')}
        onPause={() => console.log('Pause agent')}
        onDelete={() => console.log('Delete agent')}
      />
      <AgentCard
        id="2"
        name="RAG Service"
        version="0.1.0"
        status="paused"
        runCount={125}
        image={ragIcon}
        description="Document retrieval and question answering system"
        onView={() => console.log('View agent')}
      />
      <AgentCard
        id="3"
        name="DevOps Bot"
        version="0.2.1"
        status="stopped"
        runCount={89}
        image={devopsIcon}
        description="Automated deployment and monitoring assistant"
        onView={() => console.log('View agent')}
      />
    </div>
  )
}
