import "dotenv/config";

import { logger } from "./logger/logger.js";
import { app } from "./app.js";
import { connectDB, runMigration, pool } from "./config/database.js";

let server;
let port = process.env.PORT;

process.on("uncaughtException", (err) => {
  logger.error("UNCAUGHT EXCEPTION", {
    message: err.message,
    stack: err.stack,
  });

  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.error("UNHANDLED REJECTION", { reason });

  process.exit(1);
});

const start = async () => {
  try {
    await connectDB();
    await runMigration();
  } catch (err) {
    logger.error("FAILED TO START APPLICATION", {
      message: err.message,
      stack: err.stack,
    });

    process.exit(1);
  }
};

start();

process.on("SIGTERM", gracefullShutdown);
process.on("SIGINT", gracefullShutdown);

async function gracefullShutdown() {
  logger.info("Shutting down server");

  if (server) {
    server.close(async () => {
      await pool.end();

      logger.info("Server closed gracefully");
      process.exit(0);
    });
  } else {
    process.exit(1);
  }
}
