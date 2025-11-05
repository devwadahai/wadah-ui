import { encodeFunctionData, parseUnits, type Address, type Hex } from 'viem';
import { useWalletClient, usePublicClient } from 'wagmi';
import { useState, useCallback } from 'react';

// USDC contract address on Base mainnet
export const USDC_BASE_MAINNET = '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913' as Address;
// USDC contract address on Base Sepolia testnet
export const USDC_BASE_SEPOLIA = '0x036CbD53842c5426634e7929541eC2318f3dCF7e' as Address;

// EIP-3009 transferWithAuthorization function ABI
const TRANSFER_WITH_AUTHORIZATION_ABI = {
  name: 'transferWithAuthorization',
  type: 'function',
  stateMutability: 'nonpayable',
  inputs: [
    { name: 'from', type: 'address' },
    { name: 'to', type: 'address' },
    { name: 'value', type: 'uint256' },
    { name: 'validAfter', type: 'uint256' },
    { name: 'validBefore', type: 'uint256' },
    { name: 'nonce', type: 'bytes32' },
    { name: 'v', type: 'uint8' },
    { name: 'r', type: 'bytes32' },
    { name: 's', type: 'bytes32' },
  ],
  outputs: [],
} as const;

// USDC approve ABI
const APPROVE_ABI = {
  name: 'approve',
  type: 'function',
  stateMutability: 'nonpayable',
  inputs: [
    { name: 'spender', type: 'address' },
    { name: 'amount', type: 'uint256' },
  ],
  outputs: [{ name: '', type: 'bool' }],
} as const;

// USDC transfer ABI
const TRANSFER_ABI = {
  name: 'transfer',
  type: 'function',
  stateMutability: 'nonpayable',
  inputs: [
    { name: 'to', type: 'address' },
    { name: 'amount', type: 'uint256' },
  ],
  outputs: [{ name: '', type: 'bool' }],
} as const;

// USDC balanceOf ABI
const BALANCE_OF_ABI = {
  name: 'balanceOf',
  type: 'function',
  stateMutability: 'view',
  inputs: [{ name: 'account', type: 'address' }],
  outputs: [{ name: '', type: 'uint256' }],
} as const;

export interface PaymentParams {
  to: Address;
  amount: string; // Amount in smallest unit (e.g., 1000000 for 1 USDC)
  network: 'base' | 'base-sepolia';
}

export interface PaymentResult {
  success: boolean;
  txHash?: Hex;
  error?: string;
}

/**
 * Hook for USDC payments using simple transfer (not EIP-3009)
 * This is simpler and works well for direct payments
 */
export function useUSDCPayment() {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUSDCAddress = useCallback((network: 'base' | 'base-sepolia'): Address => {
    return network === 'base' ? USDC_BASE_MAINNET : USDC_BASE_SEPOLIA;
  }, []);

  /**
   * Check USDC balance
   */
  const checkBalance = useCallback(async (
    userAddress: Address,
    network: 'base' | 'base-sepolia'
  ): Promise<bigint> => {
    if (!publicClient) throw new Error('Public client not available');

    const usdcAddress = getUSDCAddress(network);
    
    const balance = await publicClient.readContract({
      address: usdcAddress,
      abi: [BALANCE_OF_ABI],
      functionName: 'balanceOf',
      args: [userAddress],
    });

    return balance as bigint;
  }, [publicClient, getUSDCAddress]);

  /**
   * Execute a USDC payment using simple transfer
   */
  const pay = useCallback(async (params: PaymentParams): Promise<PaymentResult> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!walletClient) {
        throw new Error('Wallet not connected');
      }

      if (!publicClient) {
        throw new Error('Public client not available');
      }

      const { to, amount, network } = params;
      const usdcAddress = getUSDCAddress(network);
      const userAddress = walletClient.account.address;

      // Check balance
      const balance = await checkBalance(userAddress, network);
      const amountBigInt = BigInt(amount);

      if (balance < amountBigInt) {
        throw new Error(`Insufficient USDC balance. Have: ${balance}, Need: ${amountBigInt}`);
      }

      // Execute transfer
      const hash = await walletClient.writeContract({
        address: usdcAddress,
        abi: [TRANSFER_ABI],
        functionName: 'transfer',
        args: [to, amountBigInt],
        chain: walletClient.chain,
        account: userAddress,
      });

      // Wait for transaction confirmation
      const receipt = await publicClient.waitForTransactionReceipt({
        hash,
        confirmations: 1,
      });

      if (receipt.status === 'reverted') {
        throw new Error('Transaction reverted');
      }

      setIsLoading(false);
      return {
        success: true,
        txHash: hash,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      setError(errorMessage);
      setIsLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  }, [walletClient, publicClient, getUSDCAddress, checkBalance]);

  return {
    pay,
    checkBalance,
    isLoading,
    error,
  };
}

/**
 * Format USDC amount for display (6 decimals)
 */
export function formatUSDC(amount: string | bigint): string {
  const amountBigInt = typeof amount === 'string' ? BigInt(amount) : amount;
  const usdcAmount = Number(amountBigInt) / 1_000_000;
  return `${usdcAmount.toFixed(2)} USDC`;
}

/**
 * Parse USDC amount from display format to smallest unit
 */
export function parseUSDC(displayAmount: string): string {
  const amount = parseFloat(displayAmount);
  return (amount * 1_000_000).toString();
}

