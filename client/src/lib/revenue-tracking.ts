import { usePublicClient, useAccount } from 'wagmi';
import { useState, useEffect, useCallback } from 'react';
import type { Address, Hex } from 'viem';
import { USDC_BASE_MAINNET, USDC_BASE_SEPOLIA, formatUSDC } from './usdc-payment';

// USDC Transfer event ABI
const TRANSFER_EVENT_ABI = {
  type: 'event',
  name: 'Transfer',
  inputs: [
    { name: 'from', type: 'address', indexed: true },
    { name: 'to', type: 'address', indexed: true },
    { name: 'value', type: 'uint256', indexed: false },
  ],
} as const;

// Balance ABI
const BALANCE_OF_ABI = {
  name: 'balanceOf',
  type: 'function',
  stateMutability: 'view',
  inputs: [{ name: 'account', type: 'address' }],
  outputs: [{ name: '', type: 'uint256' }],
} as const;

export interface Transaction {
  id: string;
  from: Address;
  to: Address;
  amount: bigint;
  amountFormatted: string;
  timestamp: Date;
  txHash: Hex;
  blockNumber: bigint;
}

export interface RevenueStats {
  totalEarnings: bigint;
  totalEarningsFormatted: string;
  totalTransactions: number;
  uniquePayers: number;
  averageAmount: bigint;
  averageAmountFormatted: string;
  balance: bigint;
  balanceFormatted: string;
}

/**
 * Hook for tracking USDC revenue from blockchain events
 */
export function useRevenueTracking(network: 'base' | 'base-sepolia' = 'base') {
  const publicClient = usePublicClient();
  const { address } = useAccount();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<RevenueStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const usdcAddress = network === 'base' ? USDC_BASE_MAINNET : USDC_BASE_SEPOLIA;

  /**
   * Fetch revenue transactions from blockchain
   */
  const fetchRevenue = useCallback(async (recipientAddress: Address) => {
    if (!publicClient) {
      setError('Public client not available');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get current block number
      const currentBlock = await publicClient.getBlockNumber();
      
      // Query last 10,000 blocks (roughly last few days on Base)
      const fromBlock = currentBlock - 10000n > 0n ? currentBlock - 10000n : 0n;

      // Query Transfer events where this address is the recipient
      const logs = await publicClient.getLogs({
        address: usdcAddress,
        event: TRANSFER_EVENT_ABI,
        args: {
          to: recipientAddress,
        },
        fromBlock,
        toBlock: currentBlock,
      });

      // Process logs into transactions
      const txs: Transaction[] = [];
      for (const log of logs) {
        // Get block to extract timestamp
        const block = await publicClient.getBlock({
          blockNumber: log.blockNumber,
        });

        txs.push({
          id: `${log.transactionHash}-${log.logIndex}`,
          from: log.args.from!,
          to: log.args.to!,
          amount: log.args.value!,
          amountFormatted: formatUSDC(log.args.value!.toString()),
          timestamp: new Date(Number(block.timestamp) * 1000),
          txHash: log.transactionHash,
          blockNumber: log.blockNumber,
        });
      }

      // Sort by timestamp descending (newest first)
      txs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      setTransactions(txs);

      // Calculate stats
      const totalEarnings = txs.reduce((sum, tx) => sum + tx.amount, 0n);
      const uniquePayers = new Set(txs.map(tx => tx.from.toLowerCase())).size;
      const averageAmount = txs.length > 0 ? totalEarnings / BigInt(txs.length) : 0n;

      // Get current balance
      const balance = await publicClient.readContract({
        address: usdcAddress,
        abi: [BALANCE_OF_ABI],
        functionName: 'balanceOf',
        args: [recipientAddress],
      });

      setStats({
        totalEarnings,
        totalEarningsFormatted: formatUSDC(totalEarnings.toString()),
        totalTransactions: txs.length,
        uniquePayers,
        averageAmount,
        averageAmountFormatted: formatUSDC(averageAmount.toString()),
        balance: balance as bigint,
        balanceFormatted: formatUSDC((balance as bigint).toString()),
      });

      setIsLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch revenue';
      setError(errorMessage);
      setIsLoading(false);
      console.error('Revenue tracking error:', err);
    }
  }, [publicClient, usdcAddress]);

  // Auto-fetch when address changes
  useEffect(() => {
    if (address) {
      fetchRevenue(address);
    }
  }, [address, fetchRevenue]);

  return {
    transactions,
    stats,
    isLoading,
    error,
    refetch: () => address && fetchRevenue(address),
  };
}

/**
 * Format time ago
 */
export function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

