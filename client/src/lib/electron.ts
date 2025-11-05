/**
 * Electron integration utilities
 * Provides type-safe access to Electron APIs when running in desktop mode
 */

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
    wadahAPI?: WadahAPI;
  }
}

/**
 * Check if the app is running in Electron
 */
export function isElectron(): boolean {
  return typeof window !== 'undefined' && window.wadahAPI !== undefined;
}

/**
 * Get the Electron API (only available when running in Electron)
 */
export function getElectronAPI(): WadahAPI | null {
  if (isElectron()) {
    return window.wadahAPI!;
  }
  return null;
}

/**
 * Execute a wadah CLI command (works in both web and Electron modes)
 * In web mode, uses the REST API
 * In Electron mode, uses the native API
 */
export async function executeWadahCommand(
  command: string,
  args: any = {}
): Promise<{ success: boolean; output?: string; error?: string }> {
  const electronAPI = getElectronAPI();
  
  if (electronAPI) {
    // Running in Electron - use native API
    switch (command) {
      case 'version':
        return electronAPI.getVersion();
      case 'init':
        return electronAPI.initAgent(args.name, args.options || {});
      case 'pack':
        return electronAPI.packAgent(args.manifestPath, args.options || {});
      case 'run':
        return electronAPI.runAgent(args.specPath, args.options || {});
      case 'verify':
        return electronAPI.verifyPackage(args.packagePath);
      case 'list-agents':
        return electronAPI.listAgents();
      default:
        return {
          success: false,
          error: `Unknown command: ${command}`
        };
    }
  } else {
    // Running in web mode - use REST API
    // This would call your Express server endpoints
    try {
      const response = await fetch(`/api/wadah/${command}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(args)
      });
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: String(error)
      };
    }
  }
}

