# Wadah Desktop - AI Agent Management Platform

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

### 🚦 Feature Status

| Feature | Status | Notes |
|---------|--------|-------|
| Agent Management | ✅ Production | Create, manage, run agents |
| Registry Integration | ✅ Production | Push/pull to OCI registries |
| Templates & Builder | ✅ Production | 6+ production-ready templates |
| Settings & Config | ✅ Production | API keys, environment variables |
| **x402 Payments** | ✅ **Production** | **Real USDC payments on Base network** |
| Wallet Connection | ✅ Production | Web3 wallet integration (Coinbase, MetaMask, WalletConnect) |
| Agent Marketplace | ✅ Production | Browse and run paid agents with crypto payments |
| Revenue Dashboard | ✅ Production | Real-time blockchain revenue tracking |

> **✅ Fully Functional**: All x402 crypto payment features are now fully implemented with real blockchain transactions. See [PAYMENT_TESTING_GUIDE.md](PAYMENT_TESTING_GUIDE.md) for complete testing instructions.

## ✨ Features

### 🤖 Agent Management
- **Create New Agents** from production-ready templates
- **Browse & Manage** all your agents in one place
- **Run Agents** with real-time output
- **Package Agents** into distributable `.wpkg` files

### 💰 x402 Crypto Payments (✅ Production Ready!)
- **Pay-per-Execution** model for premium agents with real USDC payments
- **Wallet Integration** - Coinbase Wallet, MetaMask, WalletConnect ✅ Working
- **Multi-Chain Support** - Base, Ethereum, Base Sepolia ✅ Working
- **Agent Marketplace** - Browse and run paid AI agents ✅ Working
- **Revenue Dashboard** - Real-time blockchain revenue tracking ✅ Working
- **USDC Payments** - Low-fee transactions on Base network ✅ Working

> **✅ Status**: Fully implemented and production-ready! Real USDC payments on Base network with blockchain revenue tracking. Test on Base Sepolia before mainnet deployment. See [PAYMENT_TESTING_GUIDE.md](PAYMENT_TESTING_GUIDE.md).

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

> A complete walkthrough of Wadah Desktop's features

### 1. Dashboard - Your Command Center
![Dashboard](screenshots/01-dashboard.png)
*Start here: Overview of your agents, templates, and recent activity with quick access to all features*

### 2. Agents - Manage Your AI Workforce
![Agents List](screenshots/02-agents-list.png)
*View, search, and manage all your AI agents with status indicators and quick actions*

### 3. Agent Builder - Create with Templates
![Agent Builder](screenshots/03-agent-builder.png)
*Build new agents from production-ready templates: customer support, RAG systems, DevOps bots, and more*

### 4. Agent Details - Configure & Customize
![Agent Details](screenshots/04-agent-details.png)
*Fine-tune your agent: model selection, security settings, prompts, and advanced configurations*

### 5. Templates Library
![Templates](screenshots/05-templates.png)
*Explore 6+ production-ready templates spanning customer support, data analysis, RAG systems, and automation*

### 6. Template Details - Preview Before Creating
![Template Details](screenshots/06-template-details.png)
*Read documentation, understand the template structure, and clone to start building*

### 7. Run Agent - Execute & Test
![Run Agent](screenshots/07-run-agent.png)
*Run your agents with custom prompts, view environment status, and access recent run history*

### 8. Real-time Output - See Results Live
![Run Output](screenshots/08-run-output.png)
*Watch your agent execute in real-time with streaming output, cost tracking, and execution details*

### 9. Registry - Package Management
![Registry](screenshots/09-registry.png)
*Manage local .wpkg packages, push to OCI registries, and pull shared agents from the community*

### 10. Create Package - Build for Distribution
![Create Package](screenshots/10-create-package.png)
*Select an agent and package it into an OCI-compliant .wpkg file ready for distribution*

### 11. Push to Registry - Share Your Agents
![Push to Registry](screenshots/11-push-registry.png)
*Push packages to GitHub Container Registry, Docker Hub, or any OCI-compliant registry with Docker credential support*

### 12. Pull from Registry - Import Shared Agents
![Pull from Registry](screenshots/12-pull-registry.png)
*Pull packages from registries to share agents across teams or use community-created agents*

### 13. Settings - Configure Your Environment
![Settings](screenshots/13-settings.png)
*Manage API keys (OpenAI, Anthropic, Ollama), test CLI connection, and view workspace locations*

### 14. Marketplace - Browse Paid Agents (✅ Production)
![Marketplace](screenshots/17-marketplace.png)
*Explore premium AI agents with x402 crypto payments - fully functional with real USDC transactions*

### 15. Wallet Connection - Web3 Integration (✅ Production)
![Wallet Connection](screenshots/18-wallet-connection.png)
*Connect your wallet (Coinbase Wallet, MetaMask, WalletConnect) - fully functional wallet integration with real blockchain connections*

### 16. Revenue Dashboard (✅ Production)
![Revenue Dashboard](screenshots/19-revenue-dashboard.png)
*Track earnings from paid agents - real-time blockchain data with transaction history and on-chain balance tracking*

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

## ✅ x402 Payment Implementation - Production Ready!

### What's Working ✅

**Backend (Rust - 100% Complete)**:
- ✅ Full x402 protocol implementation
- ✅ Payment verification logic
- ✅ Facilitator client for Coinbase CDP
- ✅ `wadah serve` CLI command
- ✅ All 7/7 unit tests passing

**Frontend (React/Electron - 100% Complete)**:
- ✅ Wallet connection (Coinbase Wallet, MetaMask, WalletConnect)
- ✅ Real Web3/blockchain integration via wagmi
- ✅ Multi-chain support (Base, Ethereum, Sepolia)
- ✅ Complete marketplace UI
- ✅ Payment dialog with real USDC transfers
- ✅ Revenue dashboard with blockchain data
- ✅ Balance checking and validation
- ✅ Transaction submission and confirmation
- ✅ Real-time blockchain event queries
- ✅ On-chain revenue tracking

### Implemented Features 🎉

**Payment Execution**:
- ✅ Real USDC transfers using `transfer()` function
- ✅ Transaction submission via wagmi/viem
- ✅ Balance checking before payment
- ✅ Transaction confirmation tracking
- ✅ Links to BaseScan block explorer
- ✅ Error handling and user feedback

**Revenue Tracking**:
- ✅ Query real USDC Transfer events from blockchain
- ✅ Display transaction history from last 10,000 blocks
- ✅ Calculate earnings, balance, and stats
- ✅ Show unique payers and average amounts
- ✅ Clickable transaction links to BaseScan
- ✅ Real-time refresh capability

### Testing

See [PAYMENT_TESTING_GUIDE.md](PAYMENT_TESTING_GUIDE.md) for complete testing instructions on Base Sepolia testnet.

**Quick Test**:
1. Get test USDC from https://portal.cdp.coinbase.com/products/faucet
2. Connect wallet to Base Sepolia
3. Navigate to Marketplace → Run Agent
4. Pay with USDC → Verify on BaseScan
5. Check Revenue dashboard for transaction

### Documentation

For complete implementation details, see:
- **Testing Guide**: [PAYMENT_TESTING_GUIDE.md](PAYMENT_TESTING_GUIDE.md)
- **Backend**: `/wadah-engine/docs/X402_IMPLEMENTATION_SUMMARY.md`
- **Protocol**: `/wadah-engine/docs/X402_INTEGRATION_PLAN.md`
- **CDP Guide**: `/wadah-engine/docs/X402_CDP_INTEGRATION.md`

### Production Deployment

To use on Base mainnet:
1. Users need real USDC on Base network
2. All transactions will cost real money
3. Gas fees are very low on Base (~$0.01-0.05)
4. Test thoroughly on Sepolia first!

**Network Details**:
- **Testnet**: Base Sepolia (Chain ID: 84532)
- **Mainnet**: Base (Chain ID: 8453)
- **USDC Contract**: Automatically handled by code

---

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
