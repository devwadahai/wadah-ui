#!/bin/bash

echo "🎯 Interactive Wadah Testing"
echo "============================"
echo ""

# Function to wait for user
wait_for_user() {
    echo ""
    read -p "Press ENTER when ready to continue..."
    echo ""
}

# Function to ask yes/no
ask_yes_no() {
    local question="$1"
    while true; do
        read -p "$question (y/n): " yn
        case $yn in
            [Yy]* ) return 0;;
            [Nn]* ) return 1;;
            * ) echo "Please answer yes or no.";;
        esac
    done
}

echo "This will guide you through testing Wadah step-by-step."
echo ""

# Check if app is running
echo "📱 Step 1: Launch Wadah Desktop"
echo "--------------------------------"
if pgrep -f "electron.*wadah-ui" > /dev/null; then
    echo "✅ Wadah Desktop is already running!"
else
    echo "⚠️  Wadah Desktop is not running."
    if ask_yes_no "Start it now?"; then
        echo "Starting Wadah Desktop..."
        cd /Users/hsp/Projects/wadah-ui
        npm run dev:electron &
        sleep 5
        echo "✅ Started! Window should appear shortly."
    else
        echo "Please start it manually: cd /Users/hsp/Projects/wadah-ui && npm run dev:electron"
        exit 1
    fi
fi

wait_for_user

# Test 1: Dashboard
echo "📊 Step 2: Test Dashboard"
echo "-------------------------"
echo "In the Wadah app:"
echo "  1. Look at the main dashboard"
echo "  2. You should see stats cards"
echo "  3. Try clicking around"
echo ""
if ask_yes_no "Does the dashboard look good?"; then
    echo "✅ Dashboard working!"
else
    echo "❌ Dashboard has issues. Check the console for errors."
    exit 1
fi

wait_for_user

# Test 2: Templates
echo "📚 Step 3: Test Templates"
echo "------------------------"
echo "In the Wadah app:"
echo "  1. Click on 'Templates' in the sidebar"
echo "  2. You should see 6+ templates"
echo "  3. Click on 'Hello World' template"
echo "  4. Can you see the template details?"
echo ""
if ask_yes_no "Do you see the templates?"; then
    echo "✅ Templates loading!"
else
    echo "❌ Templates not loading. Check if wadah-engine templates exist."
    exit 1
fi

wait_for_user

# Test 3: Create Agent
echo "🤖 Step 4: Create a Test Agent"
echo "------------------------------"
echo "In the Wadah app:"
echo "  1. Go to 'Agent Builder'"
echo "  2. Select 'Hello World' template"
echo "  3. Enter name: 'my-test-agent'"
echo "  4. Select model: 'OpenAI GPT-4' (or any)"
echo "  5. Click 'Create Agent'"
echo "  6. Wait for creation to complete"
echo ""
if ask_yes_no "Did the agent create successfully?"; then
    echo "✅ Agent creation working!"
else
    echo "⚠️  Agent creation may have issues. Check the output."
fi

wait_for_user

# Test 4: View Agents
echo "📋 Step 5: View Your Agents"
echo "---------------------------"
echo "In the Wadah app:"
echo "  1. Click on 'Agents' in the sidebar"
echo "  2. You should see your 'my-test-agent'"
echo "  3. Click on it to view details"
echo ""
if ask_yes_no "Can you see your agent in the list?"; then
    echo "✅ Agent listing working!"
else
    echo "⚠️  Agents may not be showing. Check workspace path."
fi

wait_for_user

# Test 5: Settings
echo "⚙️  Step 6: Check Settings"
echo "-------------------------"
echo "In the Wadah app:"
echo "  1. Go to 'Settings'"
echo "  2. Scroll down"
echo "  3. You should see 'Web3 & Payment Configuration' card"
echo "  4. You should see 'API Keys' section"
echo ""
if ask_yes_no "Do you see the Web3 & Payment Configuration section?"; then
    echo "✅ New payment settings visible!"
else
    echo "⚠️  Settings may not have updated. Try refreshing."
fi

wait_for_user

# Test 6: Marketplace
echo "🛒 Step 7: Check Marketplace"
echo "----------------------------"
echo "In the Wadah app:"
echo "  1. Click on 'Marketplace' in the sidebar"
echo "  2. You should see 3 paid agents:"
echo "     • Premium Support Agent (0.01 USDC)"
echo "     • Advanced RAG System (0.05 USDC)"
echo "     • Professional DevOps Bot (0.025 USDC)"
echo "  3. Each should have a 'Run Agent' button"
echo ""
if ask_yes_no "Do you see the marketplace with paid agents?"; then
    echo "✅ Marketplace loaded!"
else
    echo "❌ Marketplace not loading."
    exit 1
fi

wait_for_user

# Test 7: Wallet Connection
echo "💰 Step 8: Test Wallet Connection (Optional)"
echo "---------------------------------------------"
echo "This requires a crypto wallet (Coinbase Wallet or MetaMask)"
echo ""
if ask_yes_no "Do you have a crypto wallet installed?"; then
    echo ""
    echo "In the Wadah app:"
    echo "  1. Click 'Connect Wallet' button in the header"
    echo "  2. Choose your wallet"
    echo "  3. Approve the connection"
    echo "  4. Your address should appear in the header"
    echo ""
    if ask_yes_no "Did the wallet connect successfully?"; then
        echo "✅ Wallet connection working!"
        
        wait_for_user
        
        echo ""
        echo "🎉 Step 9: Try a Payment (Requires Testnet Assets)"
        echo "---------------------------------------------------"
        echo "To actually test a payment, you need:"
        echo "  • Base Sepolia ETH (for gas)"
        echo "  • Base Sepolia USDC (for payment)"
        echo ""
        echo "Get them here:"
        echo "  • ETH: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet"
        echo "  • USDC: https://faucet.circle.com/"
        echo ""
        if ask_yes_no "Do you have testnet USDC and want to test a payment?"; then
            echo ""
            echo "In the Wadah app:"
            echo "  1. Make sure wallet is connected"
            echo "  2. Go to 'Marketplace'"
            echo "  3. Click 'Run Agent' on 'Premium Support Agent'"
            echo "  4. Payment dialog should open"
            echo "  5. Check your balance is shown"
            echo "  6. Click 'Pay 0.01 USDC'"
            echo "  7. Approve in your wallet"
            echo "  8. Wait for blockchain confirmation"
            echo "  9. Success message should appear with tx hash"
            echo ""
            if ask_yes_no "Did the payment complete successfully?"; then
                echo "🎉 ✅ PAYMENT WORKING! Everything is functional!"
                echo ""
                echo "Now check Revenue Dashboard:"
                echo "  1. Go to 'Revenue' in sidebar"
                echo "  2. You should see transaction appear"
                echo "  3. Stats should update"
                echo "  4. Click tx hash to view on BaseScan"
            else
                echo "⚠️  Payment failed. Check wallet balance and network."
                echo "Make sure you're on Base Sepolia network."
            fi
        else
            echo ""
            echo "💡 To test payments later:"
            echo "   1. Get testnet assets from faucets"
            echo "   2. Follow PAYMENT_TESTING_GUIDE.md"
            echo "   3. Or run this script again"
        fi
    else
        echo "⚠️  Wallet connection failed. Check:"
        echo "  • Wallet extension is installed"
        echo "  • Wallet is unlocked"
        echo "  • No console errors"
    fi
else
    echo ""
    echo "💡 To test wallet features:"
    echo "   1. Install Coinbase Wallet: https://www.coinbase.com/wallet"
    echo "   2. Or MetaMask: https://metamask.io"
    echo "   3. Run this script again"
fi

echo ""
echo "=========================="
echo "📊 Testing Summary"
echo "=========================="
echo ""
echo "✅ Completed basic feature tests"
echo "📖 For full payment testing guide: PAYMENT_TESTING_GUIDE.md"
echo "📝 For detailed checklist: TESTING_CHECKLIST.md"
echo ""
echo "🎉 Great job! Wadah is working!"
echo ""

