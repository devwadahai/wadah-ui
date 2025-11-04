import { EmptyState } from '../EmptyState'
import { Bot } from 'lucide-react'
import emptyImage from '@assets/generated_images/Empty_state_illustration_e8e0c341.png'

export default function EmptyStateExample() {
  return (
    <div className="space-y-8">
      <EmptyState
        icon={Bot}
        title="No agents yet"
        description="Get started by creating your first AI agent or browse our template library"
        actionLabel="Create Agent"
        onAction={() => console.log('Create agent')}
      />
      <EmptyState
        image={emptyImage}
        title="No data found"
        description="Try adjusting your filters or search terms"
      />
    </div>
  )
}
