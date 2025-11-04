import { StatsCard } from '../StatsCard'
import { Bot, Activity, DollarSign, TrendingUp } from 'lucide-react'

export default function StatsCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="Total Agents"
        value={12}
        icon={Bot}
        trend={{ value: "+2 this week", isPositive: true }}
      />
      <StatsCard
        title="Active Runs"
        value={3}
        icon={Activity}
      />
      <StatsCard
        title="Cost Today"
        value="$45.20"
        icon={DollarSign}
        trend={{ value: "+12% from yesterday", isPositive: false }}
      />
      <StatsCard
        title="Uptime"
        value="99.9%"
        icon={TrendingUp}
      />
    </div>
  )
}
