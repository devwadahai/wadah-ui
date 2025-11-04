# Wadah Desktop

Modern desktop application for managing AI agents with Wadah.

<div align="center">

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-0.2.0-green.svg)](https://github.com/devwadahai/wadah-ui/releases)

**Visual interface for the Wadah AI agent runtime**

[Download](https://github.com/devwadahai/wadah-ui/releases) • [Documentation](https://github.com/devwadahai/wadah-engine) • [Report Bug](https://github.com/devwadahai/wadah-ui/issues)

</div>

---

## 🌊 What is Wadah Desktop?

**Wadah Desktop** is an Electron-based GUI for [Wadah](https://github.com/devwadahai/wadah-engine) - the AI agent runtime. It provides a visual interface for creating, managing, and monitoring AI agents without touching the command line.

**Think Docker Desktop, but for AI agents.**

---

## ✨ Features

### Agent Management
- 🎨 **Visual Agent Builder** - Create agents with drag-and-drop
- 📊 **Real-time Monitoring** - Watch your agents execute live
- 📚 **Template Library** - Start from pre-built templates
- 🔍 **Trace Viewer** - Debug with OpenAgentTrace (OAT)

### Developer Tools
- 💻 **Integrated Terminal** - Access wadah CLI
- 📝 **YAML Editor** - Edit manifests with syntax highlighting
- 🐳 **Registry Management** - Push/pull agent packages
- ⚙️ **Settings Panel** - Configure API keys and preferences

### System Integration
- 🖥️ **System Tray** - Run in background
- 🔔 **Notifications** - Get alerts when agents complete
- 🌓 **Dark Mode** - Beautiful UI day or night
- 🔄 **Auto-updates** - Stay up-to-date automatically

---

## 🚀 Quick Start

### Download & Install

**macOS:**
```bash
# Download from releases
curl -L https://github.com/devwadahai/wadah-ui/releases/latest/download/Wadah-Desktop-mac-arm64.dmg -o Wadah.dmg

# Or install via Homebrew (coming soon)
brew install --cask wadah
```

**Windows:**
```bash
# Download from releases
# Wadah-Desktop-win-x64.exe
```

**Linux:**
```bash
# Download AppImage
curl -L https://github.com/devwadahai/wadah-ui/releases/latest/download/Wadah-Desktop-linux-x64.AppImage -o wadah.AppImage
chmod +x wadah.AppImage
./wadah.AppImage
```

### First Run

1. **Open Wadah Desktop**
2. **Set API Keys** - Settings → API Keys
3. **Create Your First Agent** - Click "New Agent"
4. **Run It!** - Click "Run" and watch it execute

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│  Wadah Desktop (Electron)               │
│  • React + TypeScript UI                │
│  • Tailwind CSS styling                 │
│  • shadcn/ui components                 │
├─────────────────────────────────────────┤
│           ↓ IPC ↓                       │
├─────────────────────────────────────────┤
│  Main Process (Node.js)                 │
│  • Spawns wadah CLI                     │
│  • File system access                   │
│  • System integration                   │
├─────────────────────────────────────────┤
│           ↓ calls ↓                     │
├─────────────────────────────────────────┤
│  Wadah CLI (Rust)                       │
│  • Agent execution                      │
│  • Model adapters                       │
│  • Tracing & monitoring                 │
└─────────────────────────────────────────┘
```

**The desktop app is a visual wrapper around the Wadah CLI** - just like Docker Desktop wraps `docker` commands.

---

## 🛠️ Development

### Prerequisites

- Node.js 20+
- npm or pnpm
- Wadah CLI installed (from [wadah-engine](https://github.com/devwadahai/wadah-engine))

### Setup

```bash
# Clone the repository
git clone https://github.com/devwadahai/wadah-ui.git
cd wadah-ui

# Install dependencies
npm install

# Run in development mode
npm run dev:electron

# Build for production
npm run build:electron

# Package for distribution
npm run dist:mac     # macOS
npm run dist:win     # Windows
npm run dist:linux   # Linux
```

### Project Structure

```
wadah-ui/
├── electron/
│   ├── main/           # Electron main process
│   │   └── index.ts    # CLI integration, IPC handlers
│   ├── preload/        # Preload scripts
│   │   └── index.ts    # Exposed APIs
│   └── tsconfig.json
├── client/
│   ├── src/
│   │   ├── pages/      # React pages
│   │   ├── components/ # UI components
│   │   └── lib/        # Utilities
│   └── index.html
├── server/             # Express backend (for web mode)
├── assets/             # Icons, images
├── electron-builder.json
└── package.json
```

---

## 📦 Distribution

### GitHub Releases

All releases are automatically built and published to [GitHub Releases](https://github.com/devwadahai/wadah-ui/releases).

**Artifacts:**
- `Wadah-Desktop-<version>-mac-arm64.dmg` - macOS Apple Silicon
- `Wadah-Desktop-<version>-mac-x64.dmg` - macOS Intel
- `Wadah-Desktop-<version>-win-x64.exe` - Windows installer
- `Wadah-Desktop-<version>-linux-x64.AppImage` - Linux AppImage

### Auto-Updates

Wadah Desktop checks for updates automatically:
- **Check on startup**
- **Notify when available**
- **Download in background**
- **Install on restart**

No App Store needed!

---

## 🔗 Integration with Wadah CLI

Wadah Desktop calls the `wadah` CLI under the hood:

```typescript
// In the app
window.wadahAPI.initAgent('my-agent', { security: 'minimal' })

// Executes:
// wadah init my-agent --security minimal
```

**You can use both:**
- Desktop app for visual tasks
- Terminal for automation/scripts

They share the same workspace!

---

## 🎨 Screenshots

> Coming soon! Desktop app is currently in development.

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](https://github.com/devwadahai/wadah-engine/blob/main/CONTRIBUTING.md) for guidelines.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally: `npm run dev:electron`
5. Build: `npm run build:electron`
6. Submit a pull request

---

## 📚 Documentation

- **[Wadah Engine](https://github.com/devwadahai/wadah-engine)** - Core runtime and CLI
- **[UI Specification](https://github.com/devwadahai/wadah-engine/blob/main/docs/UI-SPEC.md)** - Design and architecture
- **[Cross-Repo Guide](https://github.com/devwadahai/wadah-engine/blob/main/docs/CROSS-REPO.md)** - Integration documentation
- **[Quickstart](https://github.com/devwadahai/wadah-engine/blob/main/docs/Quickstart.md)** - Getting started with Wadah

---

## 🎯 Roadmap

### v0.2.0 (Current) - MVP
- [x] Electron setup
- [x] Basic UI structure
- [x] CLI integration
- [ ] Agent builder
- [ ] Run monitor
- [ ] Template library

### v0.3.0 (Q1 2026)
- [ ] Advanced monitoring
- [ ] Team collaboration
- [ ] Plugin system
- [ ] Custom themes

### v1.0.0 (Q2 2026)
- [ ] Production ready
- [ ] Enterprise features
- [ ] Mobile companion app
- [ ] Marketplace

---

## 🐛 Known Issues

- **macOS:** Unsigned builds require right-click → Open
- **Windows:** SmartScreen warning on first install
- **Linux:** AppImage may need `--no-sandbox` flag

These will be resolved with code signing in later releases.

---

## 📄 License

Apache 2.0 - see [LICENSE](LICENSE)

---

## 🌐 Links

- **Website:** https://wadah.ai (coming soon)
- **GitHub:** https://github.com/devwadahai/wadah-ui
- **Engine:** https://github.com/devwadahai/wadah-engine
- **Issues:** https://github.com/devwadahai/wadah-ui/issues
- **Discussions:** https://github.com/devwadahai/wadah-engine/discussions

---

<div align="center">

**Wadah Desktop** - *Visual intelligence management* 🌊

Built with ❤️ using Electron, React, and TypeScript

</div>

