# Wadah Desktop - AI Agent Management Platform

<p align="center">
  <img src="assets/icon.png" alt="Wadah Logo" width="120" />
</p>

<p align="center">
  <strong>A beautiful desktop application for building, managing, and distributing AI agents</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#screenshots">Screenshots</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#development">Development</a>
</p>

---

## 🎯 Overview

Wadah Desktop is an Electron-based desktop application that provides a modern, intuitive interface for managing AI agents powered by the [Wadah Engine](https://github.com/devwadahai/wadah-engine). Build, test, package, and distribute your AI agents with ease.

## ✨ Features

### 🤖 Agent Management
- **Create New Agents** from production-ready templates
- **Browse & Manage** all your agents in one place
- **Run Agents** with real-time output
- **Package Agents** into distributable `.wpkg` files

### 📦 Registry Integration
- **Push to OCI Registries** (GitHub Container Registry, Docker Hub, custom)
- **Pull from Registries** to share agents across teams
- **Docker Credential Support** - seamless authentication
- **Package Management** - view and organize local packages

### 🎨 Beautiful UI/UX
- **Modern Design** with shadcn/ui components
- **Dark/Light Mode** support
- **Real-time Feedback** for all operations
- **Responsive Layout** that works on any screen size

### 🔐 Security & Configuration
- **Environment Variable Management** - securely store API keys
- **Persistent Storage** - settings saved across sessions
- **Recent Runs History** - quick access to previous executions
- **Workspace Management** - organized file structure

### 📊 Dashboard
- **Real-time Statistics** - agents, runs, templates
- **Quick Actions** - jump to any feature
- **System Health** - CLI connection status
- **Recent Activity** - track your latest runs

## 📸 Screenshots

### Dashboard
![Dashboard](screenshots/01-dashboard.png)
*Main dashboard with real-time statistics, quick actions, and recent activity*

### Agents List
![Agents List](screenshots/02-agents-list.png)
*Browse and manage all your AI agents in one place*

### Agent Builder
![Agent Builder](screenshots/03-agent-builder.png)
*Create new agents from production-ready templates with easy configuration*

### Agent Details
![Agent Details](screenshots/04-agent-details.png)
*View and edit agent configurations*

### Templates
![Templates](screenshots/05-templates.png)
*Browse available templates for different use cases*

### Template Details
![Template Details](screenshots/06-template-details.png)
*Preview template details and clone to create new agents*

### Run Agent
![Run Agent](screenshots/07-run-agent.png)
*Execute agents with prompts and configuration*

### Run Output
![Run Output](screenshots/08-run-output.png)
*Real-time execution output and results*

### Registry & Packages
![Registry](screenshots/09-registry.png)
*Manage local packages and interact with OCI registries*

### Create Package
![Create Package](screenshots/10-create-package.png)
*Package agents into distributable .wpkg files*

### Push to Registry
![Push to Registry](screenshots/11-push-registry.png)
*Push packages to OCI registries (GitHub, Docker Hub, etc.)*

### Pull from Registry
![Pull from Registry](screenshots/12-pull-registry.png)
*Pull packages from OCI registries*

### Settings
![Settings](screenshots/13-settings.png)
*Manage environment variables, API keys, and application settings*

## 🚀 Installation

### Prerequisites

- **Node.js** 18+ and npm
- **Wadah CLI** installed and available in PATH
  ```bash
  # Install Wadah Engine
  cargo install wadah-cli
  # Or download from releases
  ```

### Quick Start

```bash
# Clone the repository
git clone https://github.com/devwadahai/wadah-ui.git
cd wadah-ui

# Install dependencies
npm install

# Run in development mode
npm run dev:electron
```

### Building for Production

```bash
# Build the Electron app
npm run build:electron

# Package for your platform
npm run dist           # Current platform
npm run dist:mac       # macOS
npm run dist:win       # Windows
npm run dist:linux     # Linux
```

The built application will be in the `release/` directory.

## 💻 Usage

### First Time Setup

1. **Launch Wadah Desktop**
2. **Go to Settings** and configure your API keys:
   - `OPENAI_API_KEY` for OpenAI models
   - `ANTHROPIC_API_KEY` for Claude models
   - `OLLAMA_URL` for local models (optional)
3. **Test Connection** to verify Wadah CLI is accessible

### Creating Your First Agent

1. Navigate to **Agent Builder**
2. Choose a template (hello-world, customer-support, RAG, etc.)
3. Configure your agent:
   - Select model (GPT-4, Claude, Ollama)
   - Set security level
   - Customize settings
4. Click **Create Agent**

### Running an Agent

1. Go to **Run Agent** page
2. Select your agent from the dropdown
3. Enter a prompt
4. Click **Run Agent**
5. View real-time output

### Packaging & Distribution

1. Navigate to **Registry** page
2. Click **Create Package**
3. Select an agent to package
4. Click **Create Package**
5. Optionally **Push to Registry**:
   - Choose registry (ghcr.io, docker.io)
   - Enter repository name
   - Set tag (latest, v1.0, etc.)
   - Click **Push to Registry**

## 🛠️ Development

### Project Structure

```
wadah-ui/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Page components
│   │   └── lib/         # Utilities
│   └── index.html
├── electron/            # Electron main & preload
│   ├── main/           # Main process
│   └── preload/        # Preload scripts
├── server/             # Express backend (web mode)
└── package.json
```

### Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Electron 28** - Desktop framework
- **Vite** - Build tool
- **TanStack Query** - Data fetching
- **shadcn/ui** - UI components
- **Tailwind CSS** - Styling
- **Wouter** - Routing

### Available Scripts

```bash
# Development
npm run dev              # Web mode
npm run dev:electron     # Electron mode

# Building
npm run build            # Web build
npm run build:electron   # Electron build

# Packaging
npm run pack             # Build without packaging
npm run dist             # Full distribution build
```

### IPC Handlers

The app communicates with Wadah CLI through Electron IPC:

- `wadah:init` - Create new agent
- `wadah:run` - Execute agent
- `wadah:pack` - Package agent
- `wadah:push-package` - Push to registry
- `wadah:pull-package` - Pull from registry
- `wadah:list-agents` - Get all agents
- `wadah:get-templates` - Get available templates
- `wadah:save-env` - Save environment variables
- `wadah:get-env` - Retrieve environment variables

## 📁 Workspace Structure

Wadah Desktop uses a consistent workspace structure:

```
~/wadah-workspace/
├── agents/              # Agent source code
│   ├── my-bot-1/
│   │   ├── wadah.yaml
│   │   ├── prompts/
│   │   └── memory/
│   └── my-bot-2/
├── packages/            # Built .wpkg packages
│   ├── my-bot-1.wpkg
│   └── my-bot-2.wpkg
└── traces/             # Execution traces
```

Environment variables are stored in:
```
~/Library/Application Support/wadah-desktop/env-config.json  # macOS
~/.config/wadah-desktop/env-config.json                      # Linux
%APPDATA%/wadah-desktop/env-config.json                      # Windows
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

Apache 2.0 - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Wadah Engine**: [github.com/devwadahai/wadah-engine](https://github.com/devwadahai/wadah-engine)
- **Documentation**: See [wadah-engine/docs](https://github.com/devwadahai/wadah-engine/tree/main/docs)
- **Templates**: See [wadah-engine/templates](https://github.com/devwadahai/wadah-engine/tree/main/templates)

## 💬 Support

For questions, issues, or feature requests:
- Open an issue on [GitHub](https://github.com/devwadahai/wadah-ui/issues)
- Check the [documentation](https://github.com/devwadahai/wadah-engine/tree/main/docs)

---

<p align="center">
  Built with ❤️ using React, TypeScript, and Electron
</p>
