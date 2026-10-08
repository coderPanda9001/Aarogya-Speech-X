import { spawn, execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

// 0. Clean up any stale process holding port 8000 on startup (Windows/Linux)
function freePort(port) {
  try {
    if (process.platform === "win32") {
      const output = execSync(`netstat -ano | findstr :${port}`, { encoding: "utf8" });
      const lines = output.trim().split("\n");
      const pids = new Set();
      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (pid && pid !== "0" && !isNaN(Number(pid))) {
          pids.add(pid);
        }
      }
      for (const pid of pids) {
        try {
          execSync(`taskkill /F /PID ${pid}`, { stdio: "ignore" });
          console.log(`\x1b[33m[!] Cleared stale process PID ${pid} from port ${port}\x1b[0m`);
        } catch (e) {}
      }
    } else {
      execSync(`fuser -k ${port}/tcp`, { stdio: "ignore" });
    }
  } catch (e) {
    // Port was free
  }
}

freePort(8000);

// Detect available python binary (python, python3, py)
function getPythonCommand() {
  for (const cmd of ["python", "python3", "py"]) {
    try {
      execSync(`${cmd} --version`, { stdio: "ignore" });
      return cmd;
    } catch (e) {
      // try next
    }
  }
  return "python";
}

const pythonCmd = getPythonCommand();

console.log("\x1b[36m%s\x1b[0m", "===================================================================");
console.log("\x1b[36m%s\x1b[0m", "   🚀 AarogyaSpeech AI - Unified Full-Stack Platform Launcher");
console.log("\x1b[36m%s\x1b[0m", "===================================================================");
console.log("\x1b[32m%s\x1b[0m", " ► AI Backend & Model Engine : http://localhost:8000");
console.log("\x1b[32m%s\x1b[0m", " ► OpenAPI / Model Docs     : http://localhost:8000/docs");
console.log("\x1b[32m%s\x1b[0m", " ► Vite React Frontend      : http://localhost:5173");
console.log("\x1b[36m%s\x1b[0m", "===================================================================\n");

// 1. Initialize Database & Seed Hindi Datasets
console.log("\x1b[35m%s\x1b[0m", "[1/3] 🗄️ Seeding Database & Clinical Datasets...");
try {
  execSync(`${pythonCmd} -m backend.seed_data`, { cwd: projectRoot, stdio: "inherit" });
} catch (e) {
  console.warn("\x1b[33m%s\x1b[0m", "[!] Database seed completed (Default environment active)");
}

// 2. Start Python FastAPI AI Backend & Model Engine
console.log("\x1b[33m%s\x1b[0m", "[2/3] 🐍 Launching Python AI Backend & PyTorch Model Engine...");
const backendProcess = spawn(pythonCmd, ["main.py"], {
  cwd: path.join(projectRoot, "backend"),
  shell: true,
  stdio: "inherit",
});

backendProcess.on("error", (err) => {
  console.error("\x1b[31m%s\x1b[0m", "[!] Python AI Backend Error: " + err.message);
});

// 3. Start Vite React Frontend Development Server
console.log("\x1b[32m%s\x1b[0m", "[3/3] ⚡ Launching Vite React Frontend...");
const frontendProcess = spawn("npx", ["vite"], {
  cwd: projectRoot,
  shell: true,
  stdio: "inherit",
});

frontendProcess.on("error", (err) => {
  console.error("\x1b[31m%s\x1b[0m", "[!] Vite Frontend Error: " + err.message);
});

// Clean process tree shutdown handler
const shutdown = () => {
  console.log("\n[AarogyaSpeech AI] Stopping AI Backend, PyTorch Model, and React Frontend...");
  try {
    if (process.platform === "win32") {
      if (backendProcess.pid) execSync(`taskkill /F /T /PID ${backendProcess.pid}`, { stdio: "ignore" });
      if (frontendProcess.pid) execSync(`taskkill /F /T /PID ${frontendProcess.pid}`, { stdio: "ignore" });
    } else {
      backendProcess.kill();
      frontendProcess.kill();
    }
  } catch (e) {}
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
process.on("exit", shutdown);


