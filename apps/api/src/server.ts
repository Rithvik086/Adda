import app from "./app.js";
import http from "node:http";
import { Server } from "socket.io";
import { initializeSocket } from "./socket/index.js";
import { env } from "./utils/config.js";
import { logger } from "./utils/logger.js";
import { initWorker } from "./rtc/sfu/workerManager.js";

const PORT = env.PORT || 3000;
var isShuttingDown: boolean = false;

const server: http.Server = app.listen(PORT, () => {
  logger.info(`API server is running on http://localhost:${PORT}`);
});

await initWorker();

export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

initializeSocket(io);

setupGracefulShutdown(server);

function setupGracefulShutdown(server: http.Server) {
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM", server));
  process.on("SIGINT", () => gracefulShutdown("SIGINT", server));

  process.on("uncaughtException", (err) => {
    logger.error("Uncaught Exception: %s", err);
    forceShutdown(1);
  });

  process.on("unhandledRejection", (reason, promise) => {
    logger.error({ promise, reason }, "Unhandled Rejection");
    forceShutdown(1);
  });
}

function gracefulShutdown(signal: string, server: http.Server) {
  if (isShuttingDown) {
    logger.info(`Shutdown already in progress, ignoring ${signal}`);
    return;
  }

  isShuttingDown = true;
  logger.info(`Recived ${signal}. Starting graceful shutdown...`);

  if (!server) {
    logger.warn("Server not initialized, exiting immidiately");
    process.exit(0);
  }

  server.close((err?: Error) => {
    if (err) {
      logger.error("Error during server close: %s", err);
      forceShutdown(1);
      return;
    }

    logger.info("HTTP server closed successfully!");
    process.exit(0);
  });

  setTimeout(() => {
    logger.error("Forced shutdown after 30 second timeout");
    forceShutdown(1);
  }, 30000);
}

function forceShutdown(code: number): void {
  logger.info(`Force shutdown with exit code: ${code}`);
  process.exit(code);
}
