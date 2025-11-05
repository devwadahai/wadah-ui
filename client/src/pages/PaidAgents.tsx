import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Coins, Play, Lock } from 'lucide-react';
import { useState } from 'react';
import { PaymentDialog } from '@/components/PaymentDialog';
import { WalletConnect } from '@/components/WalletConnect';
import { useAccount } from 'wagmi';

// Example paid agents
const paidAgents = [
  {
    id: 'premium-support',
    name: 'Premium Support Agent',
    description: 'GPT-4 powered customer support with advanced capabilities',
    price: {
      amount: '10000',
      display: '0.01 USDC',
    },
    network: 'base',
    category: 'Customer Support',
    payTo: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    asset: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
  },
  {
    id: 'advanced-rag',
    name: 'Advanced RAG System',
    description: 'High-performance retrieval-augmented generation for enterprise',
    price: {
      amount: '50000',
      display: '0.05 USDC',
    },
    network: 'base',
    category: 'AI/ML',
    payTo: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    asset: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
  },
  {
    id: 'pro-devops',
    name: 'Professional DevOps Bot',
    description: 'Automated CI/CD, monitoring, and infrastructure management',
    price: {
      amount: '25000',
      display: '0.025 USDC',
    },
    network: 'base',
    category: 'DevOps',
    payTo: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    asset: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
  },
];

export default function PaidAgents() {
  const { isConnected } = useAccount();
  const [selectedAgent, setSelectedAgent] = useState<typeof paidAgents[0] | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  const handleRunAgent = (agent: typeof paidAgents[0]) => {
    setSelectedAgent(agent);
    setShowPaymentDialog(true);
  };

  const handlePaymentComplete = (txHash: string) => {
    console.log('Payment completed:', txHash);
    // TODO: Actually run the agent after payment
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Paid Agents Marketplace</h1>
          <p className="text-muted-foreground mt-2">
            Premium AI agents powered by x402 payments on Base
          </p>
        </div>
        {!isConnected && (
          <WalletConnect />
        )}
      </div>

      {!isConnected && (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
              <Lock className="h-5 w-5" />
              Wallet Required
            </CardTitle>
            <CardDescription className="text-yellow-700 dark:text-yellow-300">
              Connect your wallet to run paid agents and make secure on-chain payments
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paidAgents.map((agent) => (
          <Card key={agent.id} className="flex flex-col hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{agent.name}</CardTitle>
                  <Badge variant="secondary" className="mt-2">
                    {agent.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                  <Coins className="h-4 w-4" />
                  <span className="text-sm font-semibold">{agent.price.display}</span>
                </div>
              </div>
              <CardDescription className="mt-2">
                {agent.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Network</span>
                  <Badge variant="outline" className="capitalize">
                    {agent.network}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment</span>
                  <span className="font-mono text-xs">x402</span>
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <Button
                className="w-full"
                onClick={() => handleRunAgent(agent)}
                disabled={!isConnected}
              >
                <Play className="mr-2 h-4 w-4" />
                Run Agent
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Payment Dialog */}
      {selectedAgent && (
        <PaymentDialog
          open={showPaymentDialog}
          onOpenChange={setShowPaymentDialog}
          requirements={{
            scheme: 'exact',
            network: selectedAgent.network,
            maxAmountRequired: selectedAgent.price.amount,
            resource: `/agent/${selectedAgent.id}/run`,
            description: selectedAgent.description,
            payTo: selectedAgent.payTo,
            asset: selectedAgent.asset,
          }}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </div>
  );
}

