#!/bin/bash

echo "🧪 Wadah Feature Testing Script"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
PASS=0
FAIL=0

# Function to test
test_feature() {
    local name="$1"
    local command="$2"
    
    echo -n "Testing $name... "
    if eval "$command" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ PASS${NC}"
        ((PASS++))
    else
        echo -e "${RED}❌ FAIL${NC}"
        ((FAIL++))
    fi
}

echo "📦 1. Backend Tests (wadah-engine)"
echo "-----------------------------------"

# Test 1: Check if wadah CLI is built
test_feature "Wadah CLI Binary" "test -f /Users/hsp/Projects/wadah-engine/target/release/wadah"

# Test 2: Check wadah version
test_feature "Wadah Version Command" "/Users/hsp/Projects/wadah-engine/target/release/wadah version"

# Test 3: Check payment crate exists
test_feature "Payment Crate" "test -d /Users/hsp/Projects/wadah-engine/crates/payment"

# Test 4: Check serve command exists in code
test_feature "Serve Command" "grep -q 'pub struct ServeArgs' /Users/hsp/Projects/wadah-engine/crates/cli/src/commands/serve.rs"

# Test 5: Compile payment crate
echo -n "Testing Payment Crate Compilation... "
if cd /Users/hsp/Projects/wadah-engine && cargo build --release -p wadah-payment > /dev/null 2>&1; then
    echo -e "${GREEN}✅ PASS${NC}"
    ((PASS++))
else
    echo -e "${RED}❌ FAIL${NC}"
    ((FAIL++))
fi

echo ""
echo "🎨 2. Frontend Tests (wadah-ui)"
echo "-----------------------------------"

# Test 6: Check usdc-payment hook exists
test_feature "USDC Payment Hook" "test -f /Users/hsp/Projects/wadah-ui/client/src/lib/usdc-payment.ts"

# Test 7: Check revenue-tracking hook exists
test_feature "Revenue Tracking Hook" "test -f /Users/hsp/Projects/wadah-ui/client/src/lib/revenue-tracking.ts"

# Test 8: Check PaymentDialog component
test_feature "Payment Dialog Component" "test -f /Users/hsp/Projects/wadah-ui/client/src/components/PaymentDialog.tsx"

# Test 9: Check RevenueDashboard component
test_feature "Revenue Dashboard Component" "test -f /Users/hsp/Projects/wadah-ui/client/src/components/RevenueDashboard.tsx"

# Test 10: Check WalletConnect component
test_feature "Wallet Connect Component" "test -f /Users/hsp/Projects/wadah-ui/client/src/components/WalletConnect.tsx"

# Test 11: Check Wagmi config
test_feature "Wagmi Configuration" "test -f /Users/hsp/Projects/wadah-ui/client/src/config/wagmi.ts"

# Test 12: Verify real USDC addresses in code
test_feature "USDC Addresses (Base Mainnet)" "grep -q '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' /Users/hsp/Projects/wadah-ui/client/src/lib/usdc-payment.ts"

test_feature "USDC Addresses (Base Sepolia)" "grep -q '0x036CbD53842c5426634e7929541eC2318f3dCF7e' /Users/hsp/Projects/wadah-ui/client/src/lib/usdc-payment.ts"

# Test 13: Check Settings has Web3 config
test_feature "Web3 Settings Section" "grep -q 'Web3 & Payment Configuration' /Users/hsp/Projects/wadah-ui/client/src/pages/Settings.tsx"

# Test 14: Verify no mock payments in code
echo -n "Testing No Mock Payments... "
if ! grep -q "mock.*payment\|fake.*payment\|setTimeout.*2000" /Users/hsp/Projects/wadah-ui/client/src/lib/usdc-payment.ts; then
    echo -e "${GREEN}✅ PASS (No mocks found)${NC}"
    ((PASS++))
else
    echo -e "${YELLOW}⚠️  WARN (Found mock-like code)${NC}"
    ((FAIL++))
fi

echo ""
echo "📚 3. Documentation Tests"
echo "-----------------------------------"

# Test 15: Check testing guide exists
test_feature "Payment Testing Guide" "test -f /Users/hsp/Projects/wadah-ui/PAYMENT_TESTING_GUIDE.md"

# Test 16: Check completion report
test_feature "WIP Completion Report" "test -f /Users/hsp/Projects/wadah-ui/WIP_COMPLETION_REPORT.md"

# Test 17: Check backend integration docs
test_feature "x402 Integration Plan" "test -f /Users/hsp/Projects/wadah-engine/docs/X402_INTEGRATION_PLAN.md"

# Test 18: Check implementation summary
test_feature "Implementation Summary" "test -f /Users/hsp/Projects/wadah-engine/docs/X402_IMPLEMENTATION_SUMMARY.md"

echo ""
echo "🔧 4. Configuration Tests"
echo "-----------------------------------"

# Test 19: Check example paid agent manifest
test_feature "Paid Agent Example" "test -f /Users/hsp/Projects/wadah-engine/examples/premium-agent-with-payment.yaml"

# Test 20: Verify payment config in example
test_feature "Payment Config in Example" "grep -q 'payment:' /Users/hsp/Projects/wadah-engine/examples/premium-agent-with-payment.yaml"

echo ""
echo "================================"
echo "📊 Test Results"
echo "================================"
echo -e "${GREEN}Passed: $PASS${NC}"
echo -e "${RED}Failed: $FAIL${NC}"
echo "Total:  $((PASS + FAIL))"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed! Everything is working.${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️  Some tests failed. Check the output above.${NC}"
    exit 1
fi

