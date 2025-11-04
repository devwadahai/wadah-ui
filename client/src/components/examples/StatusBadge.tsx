import { StatusBadge } from '../StatusBadge'

export default function StatusBadgeExample() {
  return (
    <div className="flex flex-wrap gap-2">
      <StatusBadge status="running" />
      <StatusBadge status="paused" />
      <StatusBadge status="stopped" />
      <StatusBadge status="success" />
      <StatusBadge status="error" />
    </div>
  )
}
