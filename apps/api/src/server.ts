import dotenv from "dotenv";
import app from "./app.js";
import http from "node:http";
dotenv.config();

const PORT = process.env.PORT || 3000;
var isShuttingDown: boolean = false;

const server: http.Server = app.listen(PORT, () => {
  console.log(`API server is running on http://localhost:${PORT}`);
});

setupGracefulShutdown(server);

function setupGracefulShutdown(server: http.Server) {
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM", server));
  process.on("SIGINT", () => gracefulShutdown("SIGINT", server));

  process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception: ", err);
    forceShutdown(1);
  });

  process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection", { promise, reason });
    forceShutdown(1);
  });
}

function gracefulShutdown(signal: string, server: http.Server) {
  if (isShuttingDown) {
    console.log(`Shutdown already in progress, ignoring ${signal}`);
    return;
  }

  isShuttingDown = true;
  console.log(`Recived ${signal}. Starting graceful shutdown...`);

  if (!server) {
    console.warn("Server not initialized, exiting immidiately");
    process.exit(0);
  }

  server.close((err?: Error) => {
    if (err) {
      console.error("Error during server close: ", err);
      forceShutdown(1);
      return;
    }

    console.log("HTTP server closed successfully!");
    process.exit(0);
  });

  setTimeout(() => {
    console.error("Forced shutdown after 30 second timeout");
    forceShutdown(1);
  }, 30000);
}

function forceShutdown(code: number): void {
  console.log(`Force shutdown with exit code: ${code}`);
  process.exit(code);
}
