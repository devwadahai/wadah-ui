import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle2, XCircle, Coins, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { useUSDCPayment, formatUSDC } from '@/lib/usdc-payment';
import type { Address } from 'viem';

interface PaymentRequirements {
  scheme: string;
  network: string;
  maxAmountRequired: string;
  resource: string;
  description: string;
  payTo: string;
  asset: string;
}

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requirements: PaymentRequirements;
  onPaymentComplete?: (txHash: string) => void;
}

export function PaymentDialog({
  open,
  onOpenChange,
  requirements,
  onPaymentComplete,
}: PaymentDialogProps) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { pay, checkBalance, isLoading: paying, error: paymentError } = useUSDCPayment();
  const [balance, setBalance] = useState<bigint | null>(null);
  const [paymentResult, setPaymentResult] = useState<{
    success: boolean;
    message: string;
    txHash?: string;
  } | null>(null);

  // Map network name to chain identifier
  const getNetwork = (networkName: string): 'base' | 'base-sepolia' => {
    if (networkName.toLowerCase().includes('sepolia')) {
      return 'base-sepolia';
    }
    return 'base';
  };

  const network = getNetwork(requirements.network);

  // Check balance when dialog opens
  useEffect(() => {
    if (open && address && isConnected) {
      checkBalance(address, network)
        .then(setBalance)
        .catch(console.error);
    }
  }, [open, address, isConnected, network, checkBalance]);

  const handlePay = async () => {
    if (!isConnected || !address) {
      setPaymentResult({
        success: false,
        message: 'Please connect your wallet first',
      });
      return;
    }

    setPaymentResult(null);

    try {
      const result = await pay({
        to: requirements.payTo as Address,
        amount: requirements.maxAmountRequired,
        network,
      });

      if (result.success && result.txHash) {
        setPaymentResult({
          success: true,
          message: 'Payment successful!',
          txHash: result.txHash,
        });
        
        if (onPaymentComplete) {
          onPaymentComplete(result.txHash);
        }
        
        // Close dialog after 3 seconds
        setTimeout(() => {
          onOpenChange(false);
          setPaymentResult(null);
        }, 3000);
      } else {
        setPaymentResult({
          success: false,
          message: result.error || 'Payment failed',
        });
      }
    } catch (error) {
      setPaymentResult({
        success: false,
        message: error instanceof Error ? error.message : 'Payment failed',
      });
    }
  };

  // Check if balance is sufficient
  const hasSufficientBalance = balance !== null && balance >= BigInt(requirements.maxAmountRequired);

  // Get block explorer URL
  const getExplorerUrl = (txHash: string) => {
    if (network === 'base-sepolia') {
      return `https://sepolia.basescan.org/tx/${txHash}`;
    }
    return `https://basescan.org/tx/${txHash}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Payment Required
          </DialogTitle>
          <DialogDescription>
            {requirements.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {paymentResult && (
            <Alert variant={paymentResult.success ? 'default' : 'destructive'}>
              <div className="flex items-start gap-2">
                {paymentResult.success ? (
                  <CheckCircle2 className="h-4 w-4 mt-0.5" />
                ) : (
                  <XCircle className="h-4 w-4 mt-0.5" />
                )}
                <div className="flex-1">
                  <AlertDescription className="text-sm">
                    {paymentResult.message}
                    {paymentResult.txHash && (
                      <div className="mt-2">
                        <a
                          href={getExplorerUrl(paymentResult.txHash)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-mono break-all hover:underline flex items-center gap-1"
                        >
                          View on Explorer
                          <ExternalLink className="h-3 w-3" />
                        </a>
                        <div className="text-xs font-mono text-muted-foreground mt-1">
                          {paymentResult.txHash.slice(0, 10)}...{paymentResult.txHash.slice(-8)}
                        </div>
                      </div>
                    )}
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          )}

          <div className="space-y-3 bg-muted p-4 rounded-lg">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Amount</span>
              <span className="text-sm font-medium">
                {formatUSDC(requirements.maxAmountRequired)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Network</span>
              <span className="text-sm font-medium capitalize">
                {requirements.network}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Pay To</span>
              <span className="text-xs font-mono">
                {requirements.payTo.slice(0, 6)}...{requirements.payTo.slice(-4)}
              </span>
            </div>
            {balance !== null && (
              <div className="flex justify-between pt-2 border-t">
                <span className="text-sm text-muted-foreground">Your Balance</span>
                <span className={`text-sm font-medium ${hasSufficientBalance ? 'text-green-600' : 'text-red-600'}`}>
                  {formatUSDC(balance.toString())}
                </span>
              </div>
            )}
          </div>

          {!isConnected && (
            <Alert>
              <AlertDescription className="text-sm">
                Please connect your wallet to continue with payment.
              </AlertDescription>
            </Alert>
          )}

          {isConnected && balance !== null && !hasSufficientBalance && (
            <Alert variant="destructive">
              <AlertDescription className="text-sm">
                Insufficient USDC balance. Please fund your wallet first.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={paying}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePay}
            disabled={!isConnected || paying || (balance !== null && !hasSufficientBalance)}
          >
            {paying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Coins className="mr-2 h-4 w-4" />
                Pay {formatUSDC(requirements.maxAmountRequired)}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

