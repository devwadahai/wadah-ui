import { createConfig, http } from 'wagmi';
import { base, baseSepolia, mainnet } from 'wagmi/chains';
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors';
import { createStorage } from 'wagmi';

// Use memory storage for Electron to avoid IndexedDB issues
const storage = createStorage({
  storage: {
    getItem: (key) => {
      const value = sessionStorage.getItem(key);
      return value;
    },
    setItem: (key, value) => {
      sessionStorage.setItem(key, value);
    },
    removeItem: (key) => {
      sessionStorage.removeItem(key);
    },
  },
});

// Wagmi configuration for x402 payments
export const wagmiConfig = createConfig({
  chains: [base, baseSepolia, mainnet],
  connectors: [
    injected(),
    coinbaseWallet({
      appName: 'Wadah Desktop',
      preference: 'smartWalletOnly',
    }),
    walletConnect({
      projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || '',
    }),
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
    [mainnet.id]: http(),
  },
  storage,
});

