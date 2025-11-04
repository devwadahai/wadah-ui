#!/bin/bash
# Wadah UI - Commit and Push Script
# Run this in a NEW terminal window

set -e

echo "🚀 Committing and pushing Wadah Desktop conversion..."
echo ""

cd ~/Projects/wadah-ui

echo "📝 Staging all changes..."
git add -A

echo "💾 Creating commit..."
git commit -m "feat: Convert to Electron desktop app! 🎉

Complete conversion following Docker Desktop model

**Architecture:**
- Electron desktop app with bundled Wadah CLI
- React UI (unchanged)
- System tray integration
- Auto-updates configured

**New Files:**
- electron/main/index.ts - Main process + CLI spawning
- electron/preload/index.ts - Secure IPC bridge  
- electron/tsconfig.json - TypeScript config
- electron-builder.json - Cross-platform packaging
- README.md - Complete desktop app docs
- .env.example - Environment template
- .github/workflows/release.yml - Auto-build workflow

**Updated:**
- package.json - Electron scripts and metadata
- License: Apache 2.0
- Version: 0.2.0

**Distribution (Like Docker Desktop):**
- GitHub Releases (primary)
- Direct downloads (.dmg, .exe, .AppImage)
- Homebrew/Chocolatey (future)
- NO App Stores

**Commands:**
- npm run dev:electron - Development
- npm run dist:mac - Build macOS
- npm run dist:win - Build Windows
- npm run dist:linux - Build Linux

Ready for v0.2.0! 🚀"

echo "☁️  Pushing to GitHub..."
git push origin main

echo ""
echo "✅ SUCCESS! Wadah Desktop pushed to GitHub!"
echo ""
echo "🔗 https://github.com/devwadahai/wadah-ui"
echo ""

