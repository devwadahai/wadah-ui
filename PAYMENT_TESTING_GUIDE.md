# x402 Payment Testing Guide

This guide walks you through testing the complete x402 crypto payment flow in Wadah Desktop.

## Prerequisites

1. **Wadah Desktop** installed and running
2. **Wallet** (Coinbase Wallet, MetaMask, or WalletConnect-compatible)
3. **Test USDC** on Base Sepolia testnet

## Getting Test USDC on Base Sepolia

### Option 1: Coinbase Faucet
1. Visit https://portal.cdp.coinbase.com/products/faucet
2. Connect your wallet
3. Select "Base Sepolia" network
4. Claim test ETH and USDC

### Option 2: Bridge from Sepolia
1. Get Sepolia ETH from https://sepoliafaucet.com
2. Bridge to Base Sepolia via https://bridge.base.org/deposit
3. Swap for test USDC on Base Sepolia

## Testing Steps

### 1. Connect Wallet

1. Open Wadah Desktop
2. Navigate to **Marketplace** or **Revenue** page
3. Click **Connect Wallet** button
4. Select your wallet (Coinbase Wallet, MetaMask, etc.)
5. Approve the connection
6. **Important**: Switch to **Base Sepolia** network in your wallet

### 2. Test Payment Flow

1. Navigate to **Marketplace** page
2. You should see premium agents with prices in USDC
3. Click **Run Agent** on any paid agent
4. Payment dialog will open showing:
   - Amount to pay
   - Network (base-sepolia)
   - Recipient address
   - Your current USDC balance
5. Review the details
6. Click **Pay [Amount] USDC**
7. Your wallet will prompt you to confirm the transaction
8. Approve the transaction in your wallet
9. Wait for confirmation (~2-5 seconds on Base Sepolia)
10. Success message will appear with transaction hash
11. Click the transaction hash to view on BaseScan

### 3. Verify Transaction

1. Click "View on Explorer" link in success message
2. You'll be taken to https://sepolia.basescan.org/tx/[hash]
3. Verify:
   - Transaction status: Success ✅
   - From: Your wallet address
   - To: Agent owner's address
   - Value: Correct USDC amount
   - Token: USDC (0x036C...CF7e)

### 4. Test Revenue Tracking

1. Navigate to **Revenue** page
2. Connect your wallet (if not already connected)
3. The dashboard will query the blockchain for incoming USDC transfers
4. You should see:
   - **Total Earnings**: Sum of all received USDC
   - **Current Balance**: Your current USDC balance
   - **Unique Payers**: Number of different addresses that paid you
   - **Avg Amount**: Average payment amount
   - **Recent Transactions**: List of last 10 payments with:
     - Amount
     - Time ago
     - Sender address
     - Transaction hash (clickable link to BaseScan)

### 5. Test Balance Checking

1. When opening a payment dialog, the UI automatically checks your USDC balance
2. If balance is insufficient:
   - Balance will show in red
   - Pay button will be disabled
   - Error message: "Insufficient USDC balance"
3. If balance is sufficient:
   - Balance will show in green
   - Pay button will be enabled

## Network Configuration

### Base Sepolia Testnet
- **Network Name**: Base Sepolia
- **RPC URL**: https://sepolia.base.org
- **Chain ID**: 84532
- **Currency**: ETH
- **Block Explorer**: https://sepolia.basescan.org
- **USDC Contract**: `0x036CbD53842c5426634e7929541eC2318f3dCF7e`

### Base Mainnet (Production)
- **Network Name**: Base
- **RPC URL**: https://mainnet.base.org
- **Chain ID**: 8453
- **Currency**: ETH
- **Block Explorer**: https://basescan.org
- **USDC Contract**: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`

## Troubleshooting

### "Insufficient USDC balance"
- Get test USDC from Coinbase faucet
- Make sure you're on Base Sepolia network
- Check your wallet balance

### "Wallet not connected"
- Click "Connect Wallet" button
- Approve connection in your wallet
- Refresh the page if needed

### "Wrong network"
- Switch to Base Sepolia in your wallet
- Network details above
- Some wallets auto-switch

### Transaction pending too long
- Base Sepolia blocks are ~2 seconds
- Check network status: https://sepolia.basescan.org
- Transaction may need more gas

### Revenue not showing
- Make sure you've received at least one USDC payment
- Revenue tracks last 10,000 blocks (~5.5 hours on Base)
- Click "Refresh" button to re-query blockchain
- Check your wallet is connected

## Production Deployment

When deploying to production:

1. **Update network** in code:
   - Change `'base-sepolia'` to `'base'` in revenue tracking
   - Users will need real USDC on Base mainnet

2. **Get real USDC**:
   - Buy on exchanges (Coinbase, Binance, etc.)
   - Bridge from Ethereum mainnet
   - Swap from other tokens on Base

3. **Test thoroughly**:
   - Start with small amounts
   - Test with multiple wallets
   - Verify all transactions on BaseScan

4. **Monitor**:
   - Watch for failed transactions
   - Track gas prices
   - Monitor USDC contract for any issues

## Additional Resources

- **x402 Protocol**: https://github.com/coinbase/x402
- **Base Docs**: https://docs.base.org
- **USDC on Base**: https://www.circle.com/en/usdc/base
- **Wagmi Docs**: https://wagmi.sh
- **Viem Docs**: https://viem.sh

## Test Checklist

- [ ] Wallet connects successfully
- [ ] Switch to Base Sepolia network
- [ ] USDC balance displays correctly
- [ ] Payment dialog shows correct amount
- [ ] Transaction submits successfully
- [ ] Transaction confirms on blockchain
- [ ] Transaction appears on BaseScan
- [ ] Revenue dashboard updates
- [ ] Transaction appears in "Recent Transactions"
- [ ] Stats update correctly (total earnings, balance, etc.)
- [ ] "Refresh" button works
- [ ] All transaction links work

## Success Criteria

✅ **Payment Flow Working** if:
- User can pay for agents with USDC
- Transaction confirms on blockchain
- Success message shows with tx hash
- BaseScan shows successful transaction

✅ **Revenue Tracking Working** if:
- Dashboard shows real blockchain data
- Transactions appear in list
- Stats are calculated correctly
- Refresh button updates data
- All links to BaseScan work

---

**Status**: ✅ All features fully implemented and ready for testing!

