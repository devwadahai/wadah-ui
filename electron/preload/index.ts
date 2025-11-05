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
  
  getAgent: (agentId: string) =>
    ipcRenderer.invoke('wadah:get-agent', agentId),
  
  getTemplates: () =>
    ipcRenderer.invoke('wadah:get-templates'),
  
  listPackages: () =>
    ipcRenderer.invoke('wadah:list-packages'),
  
  tagPackage: (packagePath: string, imageName: string) =>
    ipcRenderer.invoke('wadah:tag-package', packagePath, imageName),
  
  pushPackage: (imageName: string, packagePath: string) =>
    ipcRenderer.invoke('wadah:push-package', imageName, packagePath),
  
  pullPackage: (imageName: string) =>
    ipcRenderer.invoke('wadah:pull-package', imageName),
  
  // File system
  selectFile: () => 
    ipcRenderer.invoke('dialog:openFile'),
  
  selectDirectory: () => 
    ipcRenderer.invoke('dialog:openDirectory'),
  
  // Environment variables
  getEnv: (key: string) =>
    ipcRenderer.invoke('env:get', key),
  
  setEnv: (key: string, value: string) =>
    ipcRenderer.invoke('env:set', key, value),
  
  getAllEnv: () =>
    ipcRenderer.invoke('env:getAll'),
});

// TypeScript types for the exposed API
export interface WadahAPI {
  getVersion: () => Promise<{ success: boolean; version?: string; error?: string }>;
  initAgent: (name: string, options: any) => Promise<{ success: boolean; output?: string; error?: string }>;
  packAgent: (manifestPath: string, options: any) => Promise<{ success: boolean; output?: string; error?: string }>;
  runAgent: (specPath: string, options: any) => Promise<{ success: boolean; output?: string; error?: string }>;
  verifyPackage: (packagePath: string) => Promise<{ success: boolean; output?: string; error?: string }>;
  listAgents: () => Promise<{ success: boolean; agents?: any[]; error?: string }>;
  getAgent: (agentId: string) => Promise<{ success: boolean; agent?: any; error?: string }>;
  getTemplates: () => Promise<{ success: boolean; templates?: any[]; error?: string }>;
  listPackages: () => Promise<{ success: boolean; packages?: any[]; error?: string }>;
  tagPackage: (packagePath: string, imageName: string) => Promise<{ success: boolean; output?: string; error?: string }>;
  pushPackage: (imageName: string, packagePath: string) => Promise<{ success: boolean; output?: string; error?: string }>;
  pullPackage: (imageName: string) => Promise<{ success: boolean; output?: string; error?: string }>;
  selectFile: () => Promise<string | null>;
  selectDirectory: () => Promise<string | null>;
  getEnv: (key: string) => Promise<string | null>;
  setEnv: (key: string, value: string) => Promise<{ success: boolean }>;
  getAllEnv: () => Promise<Record<string, string>>;
}

declare global {
  interface Window {
    wadahAPI: WadahAPI;
  }
}

