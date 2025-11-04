import { RecentRunsList } from '../RecentRunsList'

const mockRuns = [
  { id: '1', agentName: 'RAG Service', status: 'success' as const, timestamp: '2 minutes ago', duration: '45s' },
  { id: '2', agentName: 'DevOps Bot', status: 'running' as const, timestamp: 'just now' },
  { id: '3', agentName: 'Support Agent', status: 'success' as const, timestamp: '5 minutes ago', duration: '1m 23s' },
  { id: '4', agentName: 'Data Analyzer', status: 'error' as const, timestamp: '12 minutes ago', duration: '12s' },
]

export default function RecentRunsListExample() {
  return (
    <div className="max-w-2xl">
      <RecentRunsList runs={mockRuns} onRunClick={(id) => console.log('Run clicked:', id)} />
    </div>
  )
}
