import { useState, useCallback } from 'react';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { parseUnits, formatUnits, type Address, type Hash } from 'viem';
import { base, baseSepolia } from 'viem/chains';

// USDC Contract Addresses
const USDC_ADDRESSES = {
  'base': '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as Address,
  'base-sepolia': '0x036CbD53842c5426634e7929541eC2318f3dCF7e' as Address,
} as const;

// Export constants for use in other modules
export const USDC_BASE_MAINNET = USDC_ADDRESSES['base'];
export const USDC_BASE_SEPOLIA = USDC_ADDRESSES['base-sepolia'];

// USDC ABI (ERC-20 subset)
const USDC_ABI = [
  {
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' }
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export type PaymentNetwork = 'base' | 'base-sepolia';

interface PaymentParams {
  to: Address;
  amount: string; // in smallest units (e.g., "10000" = 0.01 USDC)
  network: PaymentNetwork;
}

interface PaymentResult {
  success: boolean;
  txHash?: Hash;
  error?: string;
}

export function useUSDCPayment() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getChainId = (network: PaymentNetwork): number => {
    return network === 'base-sepolia' ? baseSepolia.id : base.id;
  };

  const checkBalance = useCallback(
    async (account: Address, network: PaymentNetwork): Promise<bigint> => {
      if (!publicClient) throw new Error('Public client not available');

      const usdcAddress = USDC_ADDRESSES[network];
      
      try {
        const balance = await publicClient.readContract({
          address: usdcAddress,
          abi: USDC_ABI,
          functionName: 'balanceOf',
          args: [account],
        }) as bigint;
        
        return balance;
      } catch (err) {
        console.error('Error checking balance:', err);
        throw new Error('Failed to check USDC balance');
      }
    },
    [publicClient]
  );

  const pay = useCallback(
    async ({ to, amount, network }: PaymentParams): Promise<PaymentResult> => {
      setIsLoading(true);
      setError(null);

      try {
        if (!address) {
          throw new Error('Wallet not connected');
        }

        if (!walletClient) {
          throw new Error('Wallet client not available');
        }

        if (!publicClient) {
          throw new Error('Public client not available');
        }

        // Check if we're on the correct network
        const requiredChainId = getChainId(network);
        if (walletClient.chain.id !== requiredChainId) {
          throw new Error(`Please switch to ${network === 'base-sepolia' ? 'Base Sepolia' : 'Base'} network`);
        }

        const usdcAddress = USDC_ADDRESSES[network];
        const amountBigInt = BigInt(amount);

        // Check balance
        const balance = await checkBalance(address, network);
        if (balance < amountBigInt) {
          throw new Error('Insufficient USDC balance');
        }

        // Execute transfer
        const hash = await walletClient.writeContract({
          address: usdcAddress,
          abi: USDC_ABI,
          functionName: 'transfer',
          args: [to, amountBigInt],
          chain: network === 'base-sepolia' ? baseSepolia : base,
        });

        // Wait for transaction confirmation
        const receipt = await publicClient.waitForTransactionReceipt({
          hash,
          confirmations: 1,
        });

        if (receipt.status === 'success') {
          return {
            success: true,
            txHash: hash,
          };
        } else {
          return {
            success: false,
            error: 'Transaction failed',
          };
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Payment failed';
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        setIsLoading(false);
      }
    },
    [address, walletClient, publicClient, checkBalance]
  );

  return {
    pay,
    checkBalance,
    isLoading,
    error,
  };
}

// Utility function to format USDC amounts
export function formatUSDC(amount: string | bigint): string {
  const amountBigInt = typeof amount === 'string' ? BigInt(amount) : amount;
  const formatted = formatUnits(amountBigInt, 6);
  return `${formatted} USDC`;
}

// Utility function to parse USDC amounts
export function parseUSDC(amount: string): bigint {
  return parseUnits(amount, 6);
}
