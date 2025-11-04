import { app, BrowserWindow, ipcMain, Tray, Menu } from 'electron';
import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

// Handle creating/removing shortcuts on Windows when installing/uninstalling
if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;

// Path to wadah CLI
const WADAH_CLI_PATH = process.env.WADAH_CLI_PATH || 
  (process.platform === 'darwin' 
    ? '/usr/local/bin/wadah'
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
    icon: path.join(__dirname, '../../assets/icon.png'),
  });

  // Load the app
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173'); // Vite dev server
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Don't close app when window is closed, minimize to tray instead
  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow?.hide();
    }
  });
}

// Create system tray
function createTray(): void {
  const iconPath = path.join(__dirname, '../../assets/tray-icon.png');
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
        app.isQuitting = true;
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
    const wadah = spawn(WADAH_CLI_PATH, [command, ...args]);
    
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
    const args = [name];
    if (options.security) args.push('--security', options.security);
    if (options.template) args.push('--template', options.template);
    
    const result = await executeWadahCommand('init', args);
    return { success: result.code === 0, output: result.stdout, error: result.stderr };
  } catch (error) {
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
    const args = [specPath];
    if (options.prompt) args.push('--prompt', options.prompt);
    if (options.interactive) args.push('--interactive');
    
    const result = await executeWadahCommand('run', args);
    return { success: result.code === 0, output: result.stdout, error: result.stderr };
  } catch (error) {
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
  app.isQuitting = true;
});

// Error handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
});

