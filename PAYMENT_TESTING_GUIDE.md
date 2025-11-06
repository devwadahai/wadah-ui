# Wadah x402 Payment Testing Guide

**Complete end-to-end testing instructions for crypto payments on Base network**

---

## 🎯 Overview

This guide walks you through testing the complete x402 payment flow in Wadah, including:
- Wallet connection (Coinbase Wallet, MetaMask)
- USDC payments on Base Sepolia testnet
- Agent marketplace payments
- Revenue tracking

---

## 📋 Prerequisites

### 1. Get Testnet ETH (for gas fees)

Base Sepolia ETH is needed to pay for transaction gas fees.

**Option A: Official Base Faucet**
```bash
# Visit: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
# Connect wallet and request Base Sepolia ETH
```

**Option B: Alchemy Faucet**
```bash
# Visit: https://www.alchemy.com/faucets/base-sepolia
# Sign in and request Base Sepolia ETH
```

### 2. Get Testnet USDC

Circle provides testnet USDC for testing.

```bash
# Visit: https://faucet.circle.com/
# Select "Base Sepolia" network
# Enter your wallet address
# Request USDC (you'll get 10 USDC for testing)
```

**Alternative: Coinbase Developer Platform**
```bash
# If you have a CDP account:
curl -X POST https://api.developer.coinbase.com/faucet/base-sepolia \
  -H "Authorization: Bearer YOUR_CDP_KEY" \
  -d '{"address": "YOUR_WALLET_ADDRESS"}'
```

### 3. Install Coinbase Wallet or MetaMask

**Coinbase Wallet** (Recommended)
- Install browser extension: https://www.coinbase.com/wallet
- Create a new wallet or import existing
- Switch to Base Sepolia network

**MetaMask**
- Install browser extension: https://metamask.io
- Add Base Sepolia network:
  - Network Name: `Base Sepolia`
  - RPC URL: `https://sepolia.base.org`
  - Chain ID: `84532`
  - Currency Symbol: `ETH`
  - Block Explorer: `https://sepolia.basescan.org`

---

## 🚀 Testing Steps

### Step 1: Configure Wadah Desktop

1. **Open Wadah Desktop**
   ```bash
   cd /Users/hsp/Projects/wadah-ui
   npm run dev:electron
   ```

2. **Navigate to Settings**
   - Click on "Settings" in the sidebar
   - Scroll to "Web3 & Payment Configuration"

3. **(Optional) Add WalletConnect Project ID**
   - Visit https://cloud.walletconnect.com
   - Create a new project
   - Copy the Project ID
   - Paste it in Wadah Settings
   - Click "Save Web3 Config"

### Step 2: Connect Your Wallet

1. **Click "Connect Wallet" in the header**

2. **Choose your wallet:**
   - **Coinbase Wallet** (Smart Wallet) - Recommended
   - **MetaMask** or other injected wallet
   - **WalletConnect** (if configured)

3. **Approve the connection in your wallet**

4. **Verify connection:**
   - Your address should appear in the header
   - Format: `0x1234...5678`
   - Click to see full address and balance

### Step 3: Test Payment Flow

#### Option A: Use Marketplace

1. **Navigate to "Marketplace"** in the sidebar

2. **Browse available paid agents:**
   - Premium Support Agent (0.01 USDC)
   - Advanced RAG System (0.05 USDC)
   - Professional DevOps Bot (0.025 USDC)

3. **Click "Run Agent"** on any agent

4. **Payment Dialog opens:**
   - Shows amount in USDC
   - Shows network (Base Sepolia)
   - Shows recipient address
   - Shows your current USDC balance
   - Checks if you have sufficient balance

5. **Click "Pay [amount] USDC"**

6. **Wallet prompts for approval:**
   - Review transaction details
   - Gas fee estimate (in ETH)
   - Total amount (in USDC)
   - Click "Confirm" in wallet

7. **Wait for confirmation:**
   - Transaction submitted indicator
   - Blockchain confirmation (usually 2-5 seconds on Base)
   - Success message with transaction hash

8. **View on Block Explorer:**
   - Click the transaction hash link
   - Opens BaseScan in new tab
   - Verify transaction details

#### Option B: Test with Custom Agent

1. **Create a paid agent manifest:**

```yaml
# ~/wadah-workspace/agents/my-paid-agent/wadah.yaml
metadata:
  name: my-paid-agent
  version: 1.0.0
  description: Test paid agent

payment:
  enabled: true
  scheme: exact
  networks:
    - base-sepolia
  price:
    amount: "10000"  # 0.01 USDC
    asset: "0x036CbD53842c5426634e7929541eC2318f3dCF7e"  # USDC on Base Sepolia
    symbol: "USDC"
    decimals: 6
  payTo: "YOUR_WALLET_ADDRESS"
  description: "Premium AI agent execution"

runtime:
  model:
    provider: openai
    name: gpt-4
  temperature: 0.7
  max_tokens: 500
  config:
    system_prompt: "You are a helpful assistant."
```

2. **Start the payment server:**

```bash
cd /Users/hsp/Projects/wadah-engine
cargo run -- serve ~/wadah-workspace/agents/my-paid-agent/wadah.yaml
```

3. **Test the HTTP endpoint:**

```bash
# Without payment - should return 402
curl -X POST http://localhost:3402/agent/my-paid-agent/run \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello"}'

# Response:
# {
#   "x402_version": "1.0",
#   "accepts": [{
#     "scheme": "exact",
#     "network": "base-sepolia",
#     "max_amount_required": "10000",
#     ...
#   }]
# }
```

4. **Make payment through UI:**
   - Use the Marketplace or custom integration
   - Pay the required amount
   - Get transaction hash

5. **Execute with payment proof:**

```bash
# With X-PAYMENT header - should execute
curl -X POST http://localhost:3402/agent/my-paid-agent/run \
  -H "Content-Type: application/json" \
  -H "X-PAYMENT: <payment_signature>" \
  -d '{"prompt": "Hello"}'
```

### Step 4: Verify Revenue Tracking

1. **Navigate to "Revenue" page**

2. **Connect wallet** (if not already connected)

3. **View real-time stats:**
   - **Total Earnings** - Sum of all USDC received
   - **Current Balance** - Your wallet's USDC balance
   - **Unique Payers** - Number of distinct addresses that paid you
   - **Avg Amount** - Average payment per transaction

4. **Recent Transactions List:**
   - Amount received (formatted in USDC)
   - Sender address
   - Transaction hash (clickable to BaseScan)
     - Time ago

5. **Click "Refresh"** to update data

6. **Verify on blockchain:**
   - Click any transaction hash
   - Check BaseScan for confirmation
   - Verify amount matches

---

## 🧪 Test Scenarios

### Scenario 1: Insufficient Balance

1. Make sure your wallet has < 0.01 USDC
2. Try to pay for an agent
3. **Expected:** Payment button disabled with warning message

### Scenario 2: Wrong Network

1. Switch wallet to Ethereum Mainnet
2. Try to connect in Wadah
3. **Expected:** Error message asking to switch to Base Sepolia

### Scenario 3: Successful Payment

1. Ensure you have ≥ 0.01 USDC and some ETH for gas
2. Pay for Premium Support Agent (0.01 USDC)
3. **Expected:** 
   - Wallet opens with transaction
   - Transaction succeeds
   - Success message appears
   - Transaction hash is shown
   - Dialog closes after 3 seconds

### Scenario 4: Revenue Tracking

1. Make a payment to yourself (send USDC to your own address)
2. Go to Revenue Dashboard
3. **Expected:**
   - Transaction appears in recent list
   - Stats update automatically
   - Balance reflects new amount

### Scenario 5: Multiple Transactions

1. Make 3 payments to different agents (or test addresses)
2. Go to Revenue Dashboard
3. **Expected:**
   - All 3 transactions appear
   - Total Earnings = sum of all 3
   - Unique Payers count = number of distinct senders

---

## 🔍 Debugging

### Check Wallet Balance

```bash
# Via Wadah UI
1. Connect wallet
2. Click wallet address in header
3. View USDC balance

# Via Block Explorer
1. Visit https://sepolia.basescan.org
2. Enter your wallet address
3. Check token balances → USDC
```

### View Transaction Details

```bash
# Via BaseScan
https://sepolia.basescan.org/tx/[TRANSACTION_HASH]

# Via Wadah UI
1. Revenue Dashboard
2. Click transaction hash
3. Opens in new tab
```

### Check Contract Addresses

```typescript
// Base Sepolia USDC Contract
0x036CbD53842c5426634e7929541eC2318f3dCF7e

// Verify on BaseScan:
https://sepolia.basescan.org/address/0x036CbD53842c5426634e7929541eC2318f3dCF7e
```

### Test RPC Connection

```bash
# Test Base Sepolia RPC
curl https://sepolia.base.org \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'

# Expected: {"jsonrpc":"2.0","id":1,"result":"0x..."}
```

---

## 📊 Expected Results

| Test | Expected Outcome |
|------|------------------|
| **Connect Wallet** | Address appears in header, balance shown |
| **View Marketplace** | 3 paid agents listed with prices |
| **Payment Dialog** | Shows correct amount, network, balance check |
| **Make Payment** | Wallet opens, transaction succeeds, hash shown |
| **Revenue Dashboard** | Transaction appears, stats update |
| **Refresh Data** | Latest blockchain data fetched |
| **Transaction Link** | Opens BaseScan with transaction details |

---

## 🚨 Troubleshooting

### Issue: "Insufficient USDC balance"

**Solution:**
1. Request more testnet USDC from https://faucet.circle.com/
2. Wait 1-2 minutes for faucet transaction to confirm
3. Refresh Wadah app

### Issue: "Please switch to Base Sepolia"

**Solution:**
1. Open wallet extension
2. Switch network to Base Sepolia
3. If network not added, add manually (see Prerequisites)
4. Refresh Wadah app

### Issue: "Wallet not connected"

**Solution:**
1. Check if wallet extension is installed
2. Check if wallet is unlocked
3. Try disconnecting and reconnecting
4. Clear browser cache if using web version

### Issue: "Transaction failed"

**Solution:**
1. Check you have enough ETH for gas fees
2. Check USDC balance is sufficient
3. Try increasing gas limit in wallet
4. Check Base Sepolia network status

### Issue: "No transactions shown in Revenue"

**Solution:**
1. Make sure you're connected with the recipient wallet
2. Check if transactions are recent (last 10,000 blocks)
3. Click "Refresh" button
4. Verify transactions exist on BaseScan

---

## 🎉 Success Checklist

- [ ] Wallet connected successfully
- [ ] Balance shown correctly (ETH + USDC)
- [ ] Payment dialog opens with correct info
- [ ] Transaction submitted to blockchain
- [ ] Transaction confirmed (hash received)
- [ ] Transaction viewable on BaseScan
- [ ] Revenue dashboard shows transaction
- [ ] Stats update correctly
- [ ] Can refresh data manually

---

## 📚 Resources

- **Base Sepolia Faucet**: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
- **Circle USDC Faucet**: https://faucet.circle.com/
- **Base Sepolia Explorer**: https://sepolia.basescan.org
- **Coinbase Wallet**: https://www.coinbase.com/wallet
- **WalletConnect**: https://cloud.walletconnect.com
- **x402 Protocol**: https://github.com/coinbase/x402
- **Wadah Docs**: https://github.com/devwadahai/wadah-engine

---

## 🔐 Security Notes

1. **Never share private keys** or seed phrases
2. **Use testnet only** for testing (Base Sepolia)
3. **Testnet tokens have no value** - safe to test
4. **Don't use real funds** on testnet
5. **Verify contract addresses** before interacting

---

## 💡 Tips

- Keep some ETH in wallet for gas fees (0.001-0.01 ETH is enough)
- Start with small amounts (0.01 USDC) for testing
- Use BaseScan to verify all transactions
- Revenue updates may take 1-2 minutes to appear
- Base Sepolia blocks are ~2 seconds, so transactions are fast
- Coinbase Smart Wallet has free gas on Base (gasless transactions)

---

**Status**: ✅ Production Ready  
**Last Updated**: November 5, 2024  
**Tested On**: Base Sepolia Testnet
