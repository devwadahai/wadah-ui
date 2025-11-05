#!/bin/bash

# Wadah Desktop - Electron App Test Script
# This script verifies that the Electron app is properly configured and ready to run

set -e  # Exit on error

echo "🧪 Testing Wadah Desktop Electron App"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Helper function
test_check() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $1"
        ((TESTS_PASSED++))
        return 0
    else
        echo -e "${RED}✗${NC} $1"
        ((TESTS_FAILED++))
        return 1
    fi
}

echo "1️⃣  Checking Dependencies"
echo "------------------------"

# Check if node_modules exists
if [ -d "node_modules" ]; then
    test_check "node_modules directory exists"
else
    echo -e "${RED}✗${NC} node_modules directory missing"
    echo "Run: npm install"
    ((TESTS_FAILED++))
fi

# Check if Electron is installed
if [ -f "node_modules/.bin/electron" ]; then
    test_check "Electron binary exists"
else
    echo -e "${RED}✗${NC} Electron not installed"
    echo "Run: npm install electron --save-dev"
    ((TESTS_FAILED++))
fi

# Check if electron-builder is installed
if [ -f "node_modules/.bin/electron-builder" ]; then
    test_check "electron-builder exists"
else
    echo -e "${RED}✗${NC} electron-builder not installed"
    ((TESTS_FAILED++))
fi

echo ""
echo "2️⃣  Checking File Structure"
echo "-------------------------"

# Check Electron files
files_to_check=(
    "electron/main/index.ts"
    "electron/preload/index.ts"
    "electron/tsconfig.json"
    "electron-builder.json"
    "assets/icon.png"
    "assets/tray-icon.png"
    "client/src/lib/electron.ts"
    "client/src/hooks/use-electron.ts"
)

for file in "${files_to_check[@]}"; do
    if [ -f "$file" ]; then
        test_check "$file exists"
    else
        echo -e "${RED}✗${NC} $file missing"
        ((TESTS_FAILED++))
    fi
done

echo ""
echo "3️⃣  Checking Build Output"
echo "-----------------------"

# Check if TypeScript compiled
if [ -f "dist-electron/main/index.js" ]; then
    test_check "Main process compiled"
else
    echo -e "${YELLOW}⚠${NC}  Main process not compiled (run: npm run build:electron)"
fi

if [ -f "dist-electron/preload/index.js" ]; then
    test_check "Preload script compiled"
else
    echo -e "${YELLOW}⚠${NC}  Preload script not compiled"
fi

if [ -f "dist-electron/renderer/index.html" ]; then
    test_check "Renderer (React app) built"
else
    echo -e "${YELLOW}⚠${NC}  Renderer not built"
fi

echo ""
echo "4️⃣  Checking Wadah CLI"
echo "--------------------"

# Check if wadah binary exists
WADAH_PATH="/Users/hsp/Projects/wadah-engine/target/release/wadah"
if [ -f "$WADAH_PATH" ]; then
    test_check "Wadah CLI binary exists"
    
    # Test if it runs
    if $WADAH_PATH --version &> /dev/null; then
        test_check "Wadah CLI is executable"
        VERSION=$($WADAH_PATH --version 2>&1 || true)
        echo "   Version: $VERSION"
    else
        echo -e "${RED}✗${NC} Wadah CLI cannot execute"
        ((TESTS_FAILED++))
    fi
else
    echo -e "${RED}✗${NC} Wadah CLI binary not found at $WADAH_PATH"
    echo "   Build it with: cd ../wadah-engine && cargo build --release"
    ((TESTS_FAILED++))
fi

echo ""
echo "5️⃣  Checking Package.json Scripts"
echo "--------------------------------"

# Check if required scripts exist
scripts=(
    "dev:electron"
    "build:electron"
    "pack"
    "dist:mac"
)

for script in "${scripts[@]}"; do
    if grep -q "\"$script\"" package.json; then
        test_check "Script '$script' exists"
    else
        echo -e "${RED}✗${NC} Script '$script' missing in package.json"
        ((TESTS_FAILED++))
    fi
done

echo ""
echo "6️⃣  Syntax Check"
echo "--------------"

# Check TypeScript syntax
echo "Checking TypeScript compilation..."
if npx tsc -p electron/tsconfig.json --noEmit 2>&1; then
    test_check "No TypeScript errors"
else
    echo -e "${RED}✗${NC} TypeScript errors found"
    ((TESTS_FAILED++))
fi

echo ""
echo "======================================"
echo "📊 Test Results"
echo "======================================"
echo ""
echo -e "${GREEN}Passed:${NC} $TESTS_PASSED tests"
echo -e "${RED}Failed:${NC} $TESTS_FAILED tests"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed! Electron app is ready!${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Run in development: npm run dev:electron"
    echo "  2. Build for production: npm run build:electron"
    echo "  3. Package for macOS: npm run dist:mac"
    echo ""
    exit 0
else
    echo -e "${RED}❌ Some tests failed. Please fix the issues above.${NC}"
    echo ""
    exit 1
fi

