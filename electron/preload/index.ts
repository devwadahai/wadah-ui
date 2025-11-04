import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('wadahAPI', {
  // Version
  getVersion: () => ipcRenderer.invoke('wadah:version'),
  
  // Agent operations
  initAgent: (name: string, options: any) => 
    ipcRenderer.invoke('wadah:init', name, options),
  
  packAgent: (manifestPath: string, options: any) => 
    ipcRenderer.invoke('wadah:pack', manifestPath, options),
  
  runAgent: (specPath: string, options: any) => 
    ipcRenderer.invoke('wadah:run', specPath, options),
  
  verifyPackage: (packagePath: string) => 
    ipcRenderer.invoke('wadah:verify', packagePath),
  
  listAgents: () => 
    ipcRenderer.invoke('wadah:list-agents'),
  
  // File system
  selectFile: () => 
    ipcRenderer.invoke('dialog:openFile'),
  
  selectDirectory: () => 
    ipcRenderer.invoke('dialog:openDirectory'),
});

// TypeScript types for the exposed API
export interface WadahAPI {
  getVersion: () => Promise<{ success: boolean; version?: string; error?: string }>;
  initAgent: (name: string, options: any) => Promise<{ success: boolean; output?: string; error?: string }>;
  packAgent: (manifestPath: string, options: any) => Promise<{ success: boolean; output?: string; error?: string }>;
  runAgent: (specPath: string, options: any) => Promise<{ success: boolean; output?: string; error?: string }>;
  verifyPackage: (packagePath: string) => Promise<{ success: boolean; output?: string; error?: string }>;
  listAgents: () => Promise<{ success: boolean; agents?: any[]; error?: string }>;
  selectFile: () => Promise<string | null>;
  selectDirectory: () => Promise<string | null>;
}

declare global {
  interface Window {
    wadahAPI: WadahAPI;
  }
}

