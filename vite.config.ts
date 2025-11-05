import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig(async ({ mode }) => {
  const isElectron = process.env.ELECTRON === 'true';
  
  return {
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  css: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
  optimizeDeps: {
    exclude: ['@coinbase/onchainkit'],
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
      outDir: isElectron 
        ? path.resolve(import.meta.dirname, "dist-electron/renderer")
        : path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
      port: 5173,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
    base: isElectron ? './' : '/',
  };
});
