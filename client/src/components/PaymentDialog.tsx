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
import { Loader2, CheckCircle2, XCircle, Coins } from 'lucide-react';
import { useState } from 'react';
import { useAccount } from 'wagmi';

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
  const [paying, setPaying] = useState(false);
  const [paymentResult, setPaymentResult] = useState<{
    success: boolean;
    message: string;
    txHash?: string;
  } | null>(null);

  const handlePay = async () => {
    if (!isConnected || !address) {
      setPaymentResult({
        success: false,
        message: 'Please connect your wallet first',
      });
      return;
    }

    setPaying(true);
    setPaymentResult(null);

    try {
      // TODO: Implement actual x402 payment flow
      // This will use the x402-fetch library or direct contract interaction
      
      // For now, simulate payment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockTxHash = '0x' + Math.random().toString(16).substr(2, 64);
      
      setPaymentResult({
        success: true,
        message: 'Payment successful!',
        txHash: mockTxHash,
      });
      
      if (onPaymentComplete) {
        onPaymentComplete(mockTxHash);
      }
      
      // Close dialog after 2 seconds
      setTimeout(() => {
        onOpenChange(false);
        setPaymentResult(null);
      }, 2000);
    } catch (error) {
      setPaymentResult({
        success: false,
        message: error instanceof Error ? error.message : 'Payment failed',
      });
    } finally {
      setPaying(false);
    }
  };

  // Format amount for display (assuming USDC with 6 decimals)
  const formatAmount = (amount: string) => {
    const numAmount = parseInt(amount) / 1_000_000;
    return `${numAmount} USDC`;
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
                <AlertDescription className="text-sm">
                  {paymentResult.message}
                  {paymentResult.txHash && (
                    <div className="mt-2 text-xs font-mono break-all">
                      Tx: {paymentResult.txHash}
                    </div>
                  )}
                </AlertDescription>
              </div>
            </Alert>
          )}

          <div className="space-y-3 bg-muted p-4 rounded-lg">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Amount</span>
              <span className="text-sm font-medium">
                {formatAmount(requirements.maxAmountRequired)}
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
          </div>

          {!isConnected && (
            <Alert>
              <AlertDescription className="text-sm">
                Please connect your wallet to continue with payment.
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
            disabled={!isConnected || paying}
          >
            {paying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Coins className="mr-2 h-4 w-4" />
                Pay {formatAmount(requirements.maxAmountRequired)}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

