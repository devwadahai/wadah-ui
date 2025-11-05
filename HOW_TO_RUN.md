# 🚀 How to Run Wadah Desktop

## Option 1: Development Mode (Recommended)

This is the best way to test the app with hot reload:

```bash
# Navigate to the project
cd /Users/hsp/Projects/wadah-ui

# Run the Electron app in development mode
npm run dev:electron
```

### What Happens:

**Terminal Output:**
```
> wadah-desktop@0.2.0 dev:electron
> concurrently "npm run dev" "wait-on http://localhost:5173 && electron ."

[0] > wadah-desktop@0.2.0 dev
[0] > NODE_ENV=development tsx server/index.ts
[0] 
[0] VITE v5.4.20  ready in 234 ms
[0] 
[0]   ➜  Local:   http://localhost:5173/
[0]   ➜  Network: use --host to expose
[0]   ➜  press h + enter to show help
[1]
[1] waiting for http://localhost:5173...
[1] http://localhost:5173 is available
[1] Launching Electron...
```

**Then an Electron window opens!** 🎉

---

## What You'll See

### The Electron Window

```
┌─────────────────────────────────────────────────────┐
│ Wadah Desktop                                  ⊗ ⊖ ⊕ │ ← Window Title Bar
├─────────────────────────────────────────────────────┤
│ ☰  Dashboard    Agents    Templates...  [Desktop] 🌓│ ← Header with "Desktop" badge
├──────┬──────────────────────────────────────────────┤
│      │                                              │
│  🏠  │  Welcome to Wadah Desktop                    │
│      │                                              │
│  🤖  │  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│      │  │ Agents   │  │ Templates│  │ Runs     │   │
│  📄  │  │    12    │  │     5    │  │    8     │   │
│      │  └──────────┘  └──────────┘  └──────────┘   │
│  🏃  │                                              │
│      │  Recent Runs:                                │
│  📦  │  • Support Bot - 2 min ago                   │
│      │  • RAG Service - 5 min ago                   │
│  ⚙️  │  • DevOps Agent - 1 hour ago                 │
│      │                                              │
└──────┴──────────────────────────────────────────────┘
   ↑                        ↑
Sidebar              Main Content Area
```

### Chrome DevTools (Auto-opens)

A separate panel on the right showing:
- **Console** - JavaScript logs
- **Elements** - DOM inspector
- **Network** - API requests
- **Sources** - Debugger

---

## Option 2: Run the Packaged App

If you want to test the "production" version:

```bash
# Navigate to the packaged app
cd /Users/hsp/Projects/wadah-ui

# Open it (macOS)
open "release/mac-arm64/Wadah Desktop.app"
```

This runs the fully packaged app without DevTools.

**Note:** On first run, macOS will say "unidentified developer" because we haven't code-signed it yet. Right-click → Open to bypass.

---

## Option 3: Web Mode (Original)

You can also run it as a web app (not Electron):

```bash
cd /Users/hsp/Projects/wadah-ui
npm run dev
```

Then open http://localhost:5173 in your browser.

---

## Controls & Features

### Navigation
- **Sidebar** - Click items to navigate between pages
- **Dashboard** - Overview of agents, templates, runs
- **Agents** - Manage your AI agents
- **Templates** - Browse pre-built templates
- **Runs** - Monitor agent executions
- **Registry** - Manage agent packages
- **Settings** - Configure API keys, preferences

### Window Controls
- **Minimize** - Window goes to tray (if tray icon exists)
- **Close** - App minimizes to tray instead of quitting
- **Quit** - Right-click tray icon → Quit

### Developer Tools
- **Cmd+Option+I** (macOS) - Toggle DevTools
- **Cmd+R** - Reload window
- **Cmd+Shift+R** - Hard reload

### Theme
- Click the 🌓 icon in the header to toggle dark/light mode

---

## Expected Behavior

### ✅ What Should Work

1. **Window Opens** - 1400x900 Electron window
2. **UI Loads** - Beautiful shadcn/ui interface
3. **Navigation** - Sidebar links work
4. **Desktop Badge** - Shows "Desktop" in header
5. **Theme Toggle** - Light/dark mode switches
6. **DevTools** - Opens automatically in dev mode
7. **Hot Reload** - Changes to code update immediately

### 🔧 What Won't Work Yet (Needs Backend)

1. **Agent Operations** - Need to implement actual wadah CLI calls
2. **Data Loading** - No real data yet (just mock data)
3. **API Calls** - Backend endpoints need implementation

---

## Troubleshooting

### Issue: Port 5173 already in use
```bash
# Find and kill the process
lsof -ti:5173 | xargs kill -9

# Or use a different port
PORT=5174 npm run dev:electron
```

### Issue: Electron doesn't start
```bash
# Make sure dependencies are installed
npm install

# Try building first
npm run build:electron
```

### Issue: Window opens but shows blank screen
```bash
# Check if dev server is running
curl http://localhost:5173

# Check Electron console for errors
# (DevTools → Console tab)
```

### Issue: "Cannot find module 'electron'"
```bash
# Reinstall Electron
npm install electron --save-dev
```

---

## Quick Commands Reference

```bash
# Development (hot reload)
npm run dev:electron

# Build for production
npm run build:electron

# Package without distributing
npm run pack

# Create distributable
npm run dist:mac          # macOS
npm run dist:win          # Windows
npm run dist:linux        # Linux

# Test everything
./test-electron.sh

# Web mode
npm run dev
```

---

## Keyboard Shortcuts (macOS)

| Action | Shortcut |
|--------|----------|
| Reload Window | Cmd+R |
| Hard Reload | Cmd+Shift+R |
| Toggle DevTools | Cmd+Option+I |
| Quit App | Cmd+Q |
| Minimize | Cmd+M |
| Hide App | Cmd+H |

---

## What's Different from Web Mode?

| Feature | Web Mode | Electron Mode |
|---------|----------|---------------|
| **Window** | Browser tab | Native app window |
| **CLI Access** | Via HTTP API | Direct IPC calls |
| **File Dialogs** | Browser picker | Native OS dialogs |
| **System Tray** | ❌ No | ✅ Yes |
| **Offline** | ❌ Needs server | ✅ Works offline |
| **Badge** | None | "Desktop" badge shown |
| **Installation** | None needed | Can be installed to /Applications |

---

## Next Steps

1. **Run it!**
   ```bash
   cd /Users/hsp/Projects/wadah-ui
   npm run dev:electron
   ```

2. **Try clicking around** - All navigation should work

3. **Check the console** - Look for any errors in DevTools

4. **Test theme toggle** - Click 🌓 to switch light/dark

5. **Try the packaged version**
   ```bash
   open "release/mac-arm64/Wadah Desktop.app"
   ```

---

## Visual Checklist

When the app starts, you should see:

- ✅ Electron window opens
- ✅ Title says "Wadah Desktop"
- ✅ Sidebar on the left with navigation
- ✅ "Desktop" badge in header (proves it's Electron mode)
- ✅ DevTools panel on the right
- ✅ No console errors (or minimal warnings)
- ✅ Theme toggle works
- ✅ Navigation works (clicking sidebar items)

---

**Ready to run? Execute this command:**

```bash
cd /Users/hsp/Projects/wadah-ui && npm run dev:electron
```

Press **Ctrl+C** in the terminal to stop when you're done! 🎉


