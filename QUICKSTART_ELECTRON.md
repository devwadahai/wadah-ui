# 🚀 Wadah Desktop - Quick Start Guide

## Running the App

### Development Mode
```bash
cd /Users/hsp/Projects/wadah-ui

# Run as Electron desktop app
npm run dev:electron

# Run as web app (original mode)
npm run dev
```

### Build for Production
```bash
# Build Electron app
npm run build:electron

# Build web app
npm run build
```

### Package for Distribution
```bash
# Test packaging (no upload)
npm run pack

# Create distributables
npm run dist:mac      # macOS DMG
npm run dist:win      # Windows installer
npm run dist:linux    # Linux AppImage
```

## File Structure

```
wadah-ui/
├── electron/              ← Electron main & preload
├── client/               ← React UI
├── server/               ← Express server (web mode)
├── assets/               ← App icons
├── dist-electron/        ← Electron build output
└── release/              ← Distribution packages
```

## Key Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Web mode with Express server |
| `npm run dev:electron` | Desktop mode with Electron |
| `npm run build:electron` | Build Electron app |
| `npm run pack` | Test package build |
| `npm run dist:mac` | Create macOS installer |

## What Changed

### Added Files
- `electron/main/index.ts` - Main process
- `electron/preload/index.ts` - Preload script
- `client/src/lib/electron.ts` - Electron utilities
- `client/src/hooks/use-electron.ts` - React hook
- `electron-builder.json` - Build config
- `assets/` - App icons

### Modified Files
- `package.json` - Added Electron scripts & dependencies
- `vite.config.ts` - Added Electron build mode
- `client/src/App.tsx` - Added Electron detection
- `electron/tsconfig.json` - Fixed output directory

## How It Works

1. **Electron Main Process** spawns wadah CLI
2. **IPC Bridge** exposes `window.wadahAPI` to renderer
3. **React App** detects mode and uses appropriate API
4. **Vite** builds for web or Electron based on `ELECTRON` env var

## Next Steps

1. Test the desktop app: `npm run dev:electron`
2. Try packaging: `npm run pack`
3. Create proper icons (optional)
4. Set up code signing (optional)
5. Distribute! 🎉

## Need Help?

See `ELECTRON_CONVERSION_COMPLETE.md` for full documentation.

---

**Status:** ✅ Conversion Complete  
**Version:** 0.2.0  
**Date:** November 4, 2025


