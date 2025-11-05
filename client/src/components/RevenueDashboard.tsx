import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Coins, Users, Activity } from 'lucide-react';

// Mock revenue data
const revenueStats = {
  totalEarnings: '2.45 USDC',
  totalRuns: 245,
  uniqueUsers: 18,
  avgPrice: '0.01 USDC',
};

const recentTransactions = [
  {
    id: '1',
    agent: 'Premium Support Agent',
    amount: '0.01 USDC',
    user: '0x1234...5678',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    txHash: '0xabcd...ef12',
  },
  {
    id: '2',
    agent: 'Advanced RAG System',
    amount: '0.05 USDC',
    user: '0x8765...4321',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    txHash: '0x1234...abcd',
  },
  {
    id: '3',
    agent: 'Professional DevOps Bot',
    amount: '0.025 USDC',
    user: '0x9abc...def0',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    txHash: '0x5678...9012',
  },
];

function formatTimeAgo(timestamp: string) {
  const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

export function RevenueDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Revenue Dashboard</h2>
        <p className="text-muted-foreground">Track earnings from your paid agents</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{revenueStats.totalEarnings}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.5%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Runs</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{revenueStats.totalRuns}</div>
            <p className="text-xs text-muted-foreground">
              Across all paid agents
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{revenueStats.uniqueUsers}</div>
            <p className="text-xs text-muted-foreground">
              Active paying customers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Price</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{revenueStats.avgPrice}</div>
            <p className="text-xs text-muted-foreground">
              Per agent execution
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest payments from your agents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0"
              >
                <div className="space-y-1">
                  <p className="font-medium">{tx.agent}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>From: {tx.user}</span>
                    <span>•</span>
                    <span>{formatTimeAgo(tx.timestamp)}</span>
                  </div>
                  <a
                    href={`https://basescan.org/tx/${tx.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline font-mono"
                  >
                    {tx.txHash}
                  </a>
                </div>
                <Badge variant="secondary" className="font-mono">
                  {tx.amount}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

