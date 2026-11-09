import app from "./app.js";
import { config } from "./config/env.js";
import { pool } from "./db/pool.js";

const server = app.listen(config.port, () => {
  console.log(`Tactyqal Express API server running on port ${config.port} [${config.nodeEnv}]`);
});

const gracefulShutdown = async (signal: string) => {
  console.log(`Received ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    console.log("HTTP server closed.");
    try {
      await pool.end();
      console.log("PostgreSQL connection pool closed.");
      process.exit(0);
    } catch (err) {
      console.error("Error closing database pool:", err);
      process.exit(1);
    }
  });
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
