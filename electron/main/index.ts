import { app, BrowserWindow, ipcMain, Tray, Menu, dialog } from 'electron';
import { spawn, ChildProcess } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// ES Module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Handle creating/removing shortcuts on Windows when installing/uninstalling
// @ts-ignore
const isSquirrelStartup = process.platform === 'win32' && require('electron-squirrel-startup');
if (isSquirrelStartup) {
  app.quit();
}

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let isQuitting = false;

// Path to wadah CLI
const WADAH_CLI_PATH = process.env.WADAH_CLI_PATH || 
  (process.platform === 'darwin' 
    ? '/Users/hsp/Projects/wadah-engine/target/release/wadah'
    : 'wadah'); // Assume in PATH

// Create the main application window
function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    title: 'Wadah Desktop',
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  // Load the app
  if (process.env.NODE_ENV === 'development') {
    const vitePort = process.env.VITE_PORT || '5173';
    mainWindow.loadURL(`http://localhost:${vitePort}`); // Vite dev server
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load from file but with proper base
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  // Handle navigation - prevent Electron from navigating away from the app
  // This allows client-side routing to work properly
  mainWindow.webContents.on('will-navigate', (event, url) => {
    const currentURL = mainWindow?.webContents.getURL() || '';
    
    // In dev mode, only allow the initial load to localhost:5173
    // Prevent any other navigation attempts so client-side router handles it
    if (process.env.NODE_ENV === 'development') {
      if (currentURL && url !== currentURL) {
        event.preventDefault();
      }
    } else {
      // In production, prevent navigation away from the loaded HTML file
      // so client-side router handles all route changes
      if (currentURL && !url.startsWith('file://')) {
        event.preventDefault();
      }
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Don't close app when window is closed, minimize to tray instead
  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow?.hide();
    }
  });
}

// Create system tray
function createTray(): void {
  // Skip tray icon if file doesn't exist
  const iconPath = path.join(__dirname, '../../assets/tray-icon.png');
  if (!fs.existsSync(iconPath)) {
    console.log('Tray icon not found, skipping tray creation');
    return;
  }
  
  tray = new Tray(iconPath);
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show Wadah',
      click: () => {
        mainWindow?.show();
      },
    },
    {
      label: 'Quit',
      click: () => {
        isQuitting = true;
        app.quit();
      },
    },
  ]);

  tray.setToolTip('Wadah Desktop');
  tray.setContextMenu(contextMenu);
  
  tray.on('click', () => {
    mainWindow?.show();
  });
}

// Execute wadah CLI command
function executeWadahCommand(
  command: string,
  args: string[]
): Promise<{ stdout: string; stderr: string; code: number }> {
  return new Promise((resolve, reject) => {
    // Pass the current environment variables to the spawned process
    // This ensures OPENAI_API_KEY and other env vars are available
    const wadah = spawn(WADAH_CLI_PATH, [command, ...args], {
      env: process.env,
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    let stdout = '';
    let stderr = '';

    wadah.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    wadah.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    wadah.on('close', (code) => {
      resolve({ stdout, stderr, code: code || 0 });
    });

    wadah.on('error', (error) => {
      reject(error);
    });
  });
}

// IPC Handlers for wadah CLI commands
ipcMain.handle('wadah:version', async () => {
  try {
    const result = await executeWadahCommand('--version', []);
    return { success: true, version: result.stdout.trim() };
  } catch (error) {
    return { success: false, error: String(error) };
  }
});

ipcMain.handle('wadah:init', async (_event, name: string, options: any) => {
  try {
    // Create agents in a consistent workspace directory
    const workspaceRoot = path.join(app.getPath('home'), 'wadah-workspace', 'agents');
    const agentPath = path.join(workspaceRoot, name);
    
    // Ensure workspace directory exists
    if (!fs.existsSync(workspaceRoot)) {
      fs.mkdirSync(workspaceRoot, { recursive: true });
    }
    
    // Check if agent already exists
    if (fs.existsSync(agentPath)) {
      return {
        success: false,
        error: `Agent "${name}" already exists at ${agentPath}`
      };
    }
    
    // Create the agent directory
    fs.mkdirSync(agentPath, { recursive: true });
    
    // Build wadah init command - output to the agent's directory
    const args = [name, '--output', agentPath];
    if (options.security) args.push('--security', options.security);
    // Note: --template option is not yet implemented in wadah CLI
    // if (options.template) args.push('--template', options.template);
    
    console.log('Executing wadah init with args:', args);
    console.log('Agent will be created at:', agentPath);
    
    const result = await executeWadahCommand('init', args);
    console.log('wadah init result:', result);
    
    // If init failed, clean up the directory
    if (result.code !== 0) {
      try {
        fs.rmSync(agentPath, { recursive: true, force: true });
      } catch (e) {
        console.error('Failed to clean up after error:', e);
      }
    }
    
    return { 
      success: result.code === 0, 
      output: result.stdout || result.stderr,
      error: result.code !== 0 ? result.stderr : undefined
    };
  } catch (error) {
    console.error('wadah init error:', error);
    return { success: false, error: String(error) };
  }
});

ipcMain.handle('wadah:pack', async (_event, manifestPath: string, options: any) => {
  try {
    const args = ['-m', manifestPath];
    if (options.output) args.push('--output', options.output);
    
    const result = await executeWadahCommand('pack', args);
    return { success: result.code === 0, output: result.stdout, error: result.stderr };
  } catch (error) {
    return { success: false, error: String(error) };
  }
});

ipcMain.handle('wadah:run', async (_event, specPath: string, options: any) => {
  try {
    console.log('Running agent with spec:', specPath);
    console.log('Options:', options);
    
    // Verify the file exists before trying to run
    if (!fs.existsSync(specPath)) {
      return { 
        success: false, 
        error: `Manifest file not found at: ${specPath}` 
      };
    }
    
    const args = [specPath];
    if (options.prompt) args.push('--prompt', options.prompt);
    if (options.interactive) args.push('--interactive');
    
    console.log('Executing wadah run with args:', args);
    const result = await executeWadahCommand('run', args);
    console.log('wadah run result:', result);
    
    return { 
      success: result.code === 0, 
      output: result.stdout || result.stderr, 
      error: result.code !== 0 ? result.stderr : undefined 
    };
  } catch (error) {
    console.error('wadah run error:', error);
    return { success: false, error: String(error) };
  }
});

ipcMain.handle('wadah:verify', async (_event, packagePath: string) => {
  try {
    const result = await executeWadahCommand('verify', [packagePath]);
    return { success: result.code === 0, output: result.stdout, error: result.stderr };
  } catch (error) {
    return { success: false, error: String(error) };
  }
});

ipcMain.handle('wadah:list-agents', async () => {
  try {
    // List agents in the workspace
    const workspacePath = path.join(app.getPath('home'), 'wadah-workspace', 'agents');
    
    if (!fs.existsSync(workspacePath)) {
      return { success: true, agents: [] };
    }
    
    const agents = fs.readdirSync(workspacePath)
      .filter(name => {
        const agentPath = path.join(workspacePath, name);
        return fs.statSync(agentPath).isDirectory();
      })
      .map(name => {
        const manifestPath = path.join(workspacePath, name, 'wadah.yaml');
        return {
          name,
          path: path.join(workspacePath, name),
          hasManifest: fs.existsSync(manifestPath),
        };
      });
    
    return { success: true, agents };
  } catch (error) {
    return { success: false, error: String(error), agents: [] };
  }
});

// Get agent details
ipcMain.handle('wadah:get-agent', async (_event, agentId: string) => {
  try {
    const workspacePath = path.join(app.getPath('home'), 'wadah-workspace', 'agents');
    const agentPath = path.join(workspacePath, agentId);
    const manifestPath = path.join(agentPath, 'wadah.yaml');
    
    if (!fs.existsSync(agentPath)) {
      return { success: false, error: `Agent "${agentId}" not found` };
    }
    
    if (!fs.existsSync(manifestPath)) {
      return { success: false, error: `Agent manifest not found at ${manifestPath}` };
    }
    
    // Read the wadah.yaml file
    const manifestContent = fs.readFileSync(manifestPath, 'utf-8');
    
    // Get directory stats
    const stats = fs.statSync(agentPath);
    
    return {
      success: true,
      agent: {
        id: agentId,
        name: agentId,
        path: agentPath,
        manifest: manifestContent,
        createdAt: stats.birthtime.toISOString(),
        modifiedAt: stats.mtime.toISOString(),
      }
    };
  } catch (error) {
    return { success: false, error: String(error) };
  }
});

// File dialog handlers
ipcMain.handle('dialog:openFile', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'YAML Files', extensions: ['yaml', 'yml'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });
  return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle('dialog:openDirectory', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });
  return result.canceled ? null : result.filePaths[0];
});

// Environment variable handlers
const ENV_CONFIG_PATH = path.join(app.getPath('userData'), 'env-config.json');

// Load saved environment variables
function loadEnvConfig(): Record<string, string> {
  try {
    if (fs.existsSync(ENV_CONFIG_PATH)) {
      const data = fs.readFileSync(ENV_CONFIG_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Failed to load env config:', error);
  }
  return {};
}

// Save environment variables
function saveEnvConfig(envVars: Record<string, string>): void {
  try {
    fs.writeFileSync(ENV_CONFIG_PATH, JSON.stringify(envVars, null, 2));
  } catch (error) {
    console.error('Failed to save env config:', error);
  }
}

// Get environment variable
ipcMain.handle('env:get', async (_event, key: string) => {
  const config = loadEnvConfig();
  return config[key] || process.env[key] || null;
});

// Set environment variable
ipcMain.handle('env:set', async (_event, key: string, value: string) => {
  const config = loadEnvConfig();
  config[key] = value;
  saveEnvConfig(config);
  // Also set it in the current process for immediate use
  process.env[key] = value;
  return { success: true };
});

// Get all stored environment variables
ipcMain.handle('env:getAll', async () => {
  return loadEnvConfig();
});

// Get templates from wadah-engine
ipcMain.handle('wadah:get-templates', async () => {
  try {
    // Path to templates directory in wadah-engine
    const templatesPath = '/Users/hsp/Projects/wadah-engine/templates';
    
    if (!fs.existsSync(templatesPath)) {
      return { success: false, error: `Templates directory not found at ${templatesPath}` };
    }
    
    const templates = fs.readdirSync(templatesPath)
      .filter(name => {
        const templatePath = path.join(templatesPath, name);
        // Only include directories (not README.md)
        return fs.statSync(templatePath).isDirectory();
      })
      .map(name => {
        const templatePath = path.join(templatesPath, name);
        const wadahYamlPath = path.join(templatePath, 'wadah.yaml');
        const readmePath = path.join(templatePath, 'README.md');
        
        let description = '';
        if (fs.existsSync(readmePath)) {
          // Read first 200 chars of README for description
          const readme = fs.readFileSync(readmePath, 'utf-8');
          description = readme.substring(0, 200).trim();
        }
        
        return {
          name,
          path: templatePath,
          hasManifest: fs.existsSync(wadahYamlPath),
          hasReadme: fs.existsSync(readmePath),
          description,
        };
      });
    
    return { success: true, templates };
  } catch (error) {
    return { success: false, error: String(error), templates: [] };
  }
});

// List local packages
ipcMain.handle('wadah:list-packages', async () => {
  try {
    const packagesPath = path.join(app.getPath('home'), 'wadah-workspace', 'packages');
    
    // Create packages directory if it doesn't exist
    if (!fs.existsSync(packagesPath)) {
      fs.mkdirSync(packagesPath, { recursive: true });
      return { success: true, packages: [] };
    }
    
    const packages = fs.readdirSync(packagesPath)
      .filter(name => name.endsWith('.wpkg'))
      .map(name => {
        const packagePath = path.join(packagesPath, name);
        const stats = fs.statSync(packagePath);
        
        return {
          name: name.replace('.wpkg', ''),
          filename: name,
          path: packagePath,
          size: stats.size,
          created: stats.birthtime.toISOString(),
          modified: stats.mtime.toISOString(),
        };
      });
    
    return { success: true, packages };
  } catch (error) {
    return { success: false, error: String(error), packages: [] };
  }
});

// Tag a package with a registry image name (DEPRECATED - wadah push does this directly)
ipcMain.handle('wadah:tag-package', async (_event, packagePath: string, imageName: string) => {
  // The wadah CLI doesn't have a separate tag command
  // Just return success and let push handle it
  return {
    success: true,
    output: `Package ready to push: ${packagePath} → ${imageName}`,
  };
});

// Push a tagged package to a registry
ipcMain.handle('wadah:push-package', async (_event, imageName: string, packagePath: string) => {
  try {
    console.log('=== PUSH DEBUG ===');
    console.log('Image name:', imageName);
    console.log('Package path:', packagePath);
    console.log('Image name type:', typeof imageName);
    console.log('Image name length:', imageName?.length);
    console.log('Image name JSON:', JSON.stringify(imageName));
    console.log('==================');
    
    if (!packagePath || !fs.existsSync(packagePath)) {
      return { success: false, error: `Package not found: ${packagePath}` };
    }
    
    // wadah push takes both the reference and the package path
    const args = [imageName, '--package', packagePath];
    console.log('Command args:', args);
    
    const result = await executeWadahCommand('push', args);
    console.log('Push result:', result);
    
    return {
      success: result.code === 0,
      output: result.stdout || result.stderr,
      error: result.code !== 0 ? result.stderr : undefined
    };
  } catch (error) {
    console.error('Push error:', error);
    return { success: false, error: String(error) };
  }
});

// Pull a package from a registry
ipcMain.handle('wadah:pull-package', async (_event, imageName: string) => {
  try {
    console.log('Pulling package:', imageName);
    
    // Extract package name from image reference for output filename
    // e.g., ghcr.io/devwadahai/dq-rag-1:latest -> dq-rag-1
    const parts = imageName.split('/');
    const lastPart = parts[parts.length - 1]; // e.g., "dq-rag-1:latest"
    const packageName = lastPart.split(':')[0]; // e.g., "dq-rag-1"
    
    // Save to packages directory
    const packagesDir = path.join(os.homedir(), 'wadah-workspace', 'packages');
    fs.mkdirSync(packagesDir, { recursive: true });
    const outputPath = path.join(packagesDir, `${packageName}.wpkg`);
    
    const result = await executeWadahCommand('pull', [imageName, '--output', outputPath]);
    console.log('Pull result:', result);
    
    return {
      success: result.code === 0,
      output: result.stdout || result.stderr,
      error: result.code !== 0 ? result.stderr : undefined,
      packagePath: outputPath
    };
  } catch (error) {
    console.error('Pull error:', error);
    return { success: false, error: String(error) };
  }
});

// Initialize: Load saved env vars into process.env on startup
const savedEnv = loadEnvConfig();
Object.assign(process.env, savedEnv);
console.log('Loaded environment variables:', Object.keys(savedEnv));

// App lifecycle
app.on('ready', () => {
  createWindow();
  createTray();
});

app.on('window-all-closed', () => {
  // On macOS, keep app running in tray
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  } else {
    mainWindow.show();
  }
});

app.on('before-quit', () => {
  isQuitting = true;
});

// Error handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
});

