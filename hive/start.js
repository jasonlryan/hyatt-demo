#!/usr/bin/env node

const { spawn } = require("child_process");
const net = require("net");

// Function to check if a port is available
// This function is no longer strictly needed for finding an alternative port,
// but can be kept if a simple check before starting is desired.
// For now, we'll simplify and remove its direct usage in the main flow.
/*
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.listen(port, () => {
      server.once("close", () => {
        resolve(true);
      });
      server.close();
    });

    server.on("error", () => {
      resolve(false);
    });
  });
}
*/

// Function to find an available port starting from a given port
// REMOVING THIS FUNCTION
/*
async function findAvailablePort(startPort = 3000) {
  let port = startPort;
  while (port < startPort + 10) {
    if (await isPortAvailable(port)) {
      return port;
    }
    port++;
  }
  throw new Error("No available ports found");
}
*/

// Function to kill process on port 3000
function killPort3000() {
  return new Promise((resolve) => {
    const killProcess = spawn("lsof", ["-ti:3000"]);
    let pids = "";

    killProcess.stdout.on("data", (data) => {
      pids += data.toString();
    });

    killProcess.on("close", (code) => {
      if (pids.trim()) {
        const pidList = pids.trim().split("\n");
        pidList.forEach((pid) => {
          if (pid.trim()) {
            // Ensure pid is not an empty string
            try {
              process.kill(parseInt(pid), "SIGKILL");
              console.log(`🔪 Killed process ${pid} on port 3000`);
            } catch (err) {
              // Process might already be dead or permission issue
              console.warn(`⚠️  Failed to kill process ${pid}: ${err.message}`);
            }
          }
        });
      }
      resolve(); // Resolve even if lsof fails or no processes found
    });

    killProcess.on("error", (err) => {
      // lsof command failed (e.g., not installed, or other errors)
      console.warn(
        `⚠️  lsof command failed: ${err.message}. Assuming port 3000 is clear or unable to check.`
      );
      resolve();
    });
  });
}

async function startServer() {
  try {
    console.log("🔍 Attempting to clear port 3000...");

    // Try to kill any existing process on port 3000
    await killPort3000();

    // Wait a moment for the port to be freed
    console.log("⏳ Waiting for port to clear...");
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Increased wait time slightly

    const targetPort = 3000;
    console.log(`✅ Attempting to start server on port ${targetPort}...`);

    // Set the PORT environment variable and start the server
    const env = {
      ...process.env,
      PORT: targetPort.toString(),
      NODE_ENV: process.env.NODE_ENV || "development",
    };
    const serverProcess = spawn("node", ["server.js"], {
      env,
      stdio: "inherit",
      cwd: __dirname,
    });

    // Note: The "Server starting on port" message will now primarily come from server.js
    // console.log(`🚀 Server starting on port ${targetPort}`);
    // console.log(`🌐 Access your app at: http://localhost:${targetPort}`);

    // Handle process termination
    process.on("SIGINT", () => {
      console.log("\n🛑 Shutting down server...");
      if (serverProcess && !serverProcess.killed) {
        serverProcess.kill("SIGINT");
      }
      process.exit(0);
    });

    serverProcess.on("close", (code) => {
      console.log(`Server process exited with code ${code}`);
      // Only exit if the server process itself exits non-zero, otherwise keep start.js alive (e.g. for nodemon-like restarts if added later)
      // For now, we'll exit with the server's code.
      process.exit(code === null ? 0 : code);
    });

    serverProcess.on("error", (err) => {
      console.error(`❌ Failed to spawn server process: ${err.message}`);
      process.exit(1);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
