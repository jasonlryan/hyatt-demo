#!/usr/bin/env node

const { spawn } = require("child_process");
const net = require("net");

// Function to check if a port is available
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

// Function to find an available port starting from a given port
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
          try {
            process.kill(parseInt(pid), "SIGKILL");
            console.log(`🔪 Killed process ${pid} on port 3000`);
          } catch (err) {
            // Process might already be dead
          }
        });
      }
      resolve();
    });

    killProcess.on("error", () => {
      // lsof command failed, probably no process on port 3000
      resolve();
    });
  });
}

async function startServer() {
  try {
    console.log("🔍 Checking for processes on port 3000...");

    // Try to kill any existing process on port 3000
    await killPort3000();

    // Wait a moment for the port to be freed
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Find an available port
    const port = await findAvailablePort(3000);

    if (port === 3000) {
      console.log("✅ Port 3000 is available, starting server...");
    } else {
      console.log(`⚠️ Port 3000 is busy, using port ${port} instead...`);
    }

    // Set the PORT environment variable and start the server
    const env = { ...process.env, PORT: port.toString() };
    const serverProcess = spawn("node", ["server.js"], {
      env,
      stdio: "inherit",
      cwd: __dirname,
    });

    console.log(`🚀 Server starting on port ${port}`);
    console.log(`🌐 Access your app at: http://localhost:${port}`);

    // Handle process termination
    process.on("SIGINT", () => {
      console.log("\n🛑 Shutting down server...");
      serverProcess.kill("SIGINT");
      process.exit(0);
    });

    serverProcess.on("close", (code) => {
      console.log(`Server process exited with code ${code}`);
      process.exit(code);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
