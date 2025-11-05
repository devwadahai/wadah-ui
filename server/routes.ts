import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { spawn } from "child_process";
import { promisify } from "util";
import { exec } from "child_process";

const execAsync = promisify(exec);

// Path to wadah CLI binary
const WADAH_CLI_PATH = process.env.WADAH_CLI_PATH || 
  (process.platform === 'darwin' 
    ? '/usr/local/bin/wadah'
    : 'wadah');

// Helper to execute wadah CLI commands
async function executeWadahCommand(
  command: string,
  args: string[] = [],
  options: { cwd?: string } = {}
): Promise<{ stdout: string; stderr: string; code: number }> {
  return new Promise((resolve, reject) => {
    const wadah = spawn(WADAH_CLI_PATH, [command, ...args], {
      cwd: options.cwd || process.cwd(),
      env: process.env,
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

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Get wadah CLI version
  app.get("/api/wadah/version", async (_req, res) => {
    try {
      const result = await executeWadahCommand("--version");
      res.json({ 
        success: true, 
        version: result.stdout.trim(),
        path: WADAH_CLI_PATH 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: String(error) 
      });
    }
  });

  // Initialize a new agent
  app.post("/api/wadah/init", async (req, res) => {
    try {
      const { name, security, template, path: projectPath } = req.body;
      
      const args = [name];
      if (security) args.push('--security', security);
      if (template) args.push('--template', template);
      
      const result = await executeWadahCommand('init', args, {
        cwd: projectPath || process.cwd()
      });
      
      res.json({
        success: result.code === 0,
        output: result.stdout,
        error: result.stderr
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: String(error) 
      });
    }
  });

  // Pack an agent
  app.post("/api/wadah/pack", async (req, res) => {
    try {
      const { manifestPath, output } = req.body;
      
      const args = ['-m', manifestPath];
      if (output) args.push('--output', output);
      
      const result = await executeWadahCommand('pack', args);
      
      res.json({
        success: result.code === 0,
        output: result.stdout,
        error: result.stderr
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: String(error) 
      });
    }
  });

  // Run an agent
  app.post("/api/wadah/run", async (req, res) => {
    try {
      const { specPath, prompt, interactive, options } = req.body;
      
      const args = [specPath];
      if (prompt) args.push('--prompt', prompt);
      if (interactive) args.push('--interactive');
      if (options?.output) args.push('--output', options.output);
      
      const result = await executeWadahCommand('run', args);
      
      res.json({
        success: result.code === 0,
        output: result.stdout,
        error: result.stderr
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: String(error) 
      });
    }
  });

  // Verify a package
  app.post("/api/wadah/verify", async (req, res) => {
    try {
      const { packagePath } = req.body;
      
      const result = await executeWadahCommand('verify', [packagePath]);
      
      res.json({
        success: result.code === 0,
        output: result.stdout,
        error: result.stderr
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: String(error) 
      });
    }
  });

  // List plugins
  app.get("/api/wadah/plugins", async (_req, res) => {
    try {
      const result = await executeWadahCommand('plugins');
      
      res.json({
        success: result.code === 0,
        output: result.stdout,
        error: result.stderr
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: String(error) 
      });
    }
  });

  // List available templates
  app.get("/api/wadah/templates", async (_req, res) => {
    try {
      // Get templates from the wadah-engine repository
      const templatesPath = process.env.WADAH_TEMPLATES_PATH || 
        '../wadah-engine/templates';
      
      const { stdout } = await execAsync(`ls -1 ${templatesPath}`);
      const templates = stdout.trim().split('\n').filter(t => t && t !== 'README.md');
      
      res.json({
        success: true,
        templates: templates.map(name => ({
          name,
          path: `${templatesPath}/${name}`
        }))
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: String(error),
        templates: []
      });
    }
  });

  // Get template details
  app.get("/api/wadah/templates/:name", async (req, res) => {
    try {
      const { name } = req.params;
      const templatesPath = process.env.WADAH_TEMPLATES_PATH || 
        '../wadah-engine/templates';
      
      const templatePath = `${templatesPath}/${name}`;
      
      // Read template files
      const { stdout: readmeContent } = await execAsync(
        `cat ${templatePath}/README.md 2>/dev/null || echo "No README available"`
      );
      
      const { stdout: manifestContent } = await execAsync(
        `cat ${templatePath}/wadah.yaml 2>/dev/null || cat ${templatePath}/wadah.yml || echo "{}"`
      );
      
      res.json({
        success: true,
        template: {
          name,
          path: templatePath,
          readme: readmeContent.trim(),
          manifest: manifestContent.trim()
        }
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: String(error) 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
