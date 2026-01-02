import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
dotenv.config();

const connectionString = process.env.DB_URL;
if (!connectionString) {
  throw new Error("Missing DB_URL in environment");
}


if (!globalThis.__pgPool) {
  globalThis.__pgPool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }, 
    max: 5, 
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

  globalThis.__pgPoolLoggedConnected = false;

  globalThis.__pgPool.on("connect", () => {
    if (!globalThis.__pgPoolLoggedConnected) {
      console.log("Connected to Render Postgres");
      globalThis.__pgPoolLoggedConnected = true;
    }
  });

  globalThis.__pgPool.on("error", (err) => {
    console.error("Unexpected Postgres client error", err);
  });

  
  const cleanup = async () => {
    try {
      await globalThis.__pgPool.end();
      console.log("Postgres pool has ended");
    } catch (e) {
      console.error("Error shutting down Postgres pool", e);
    }
  };

  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);
  process.on("exit", cleanup);
}

export default globalThis.__pgPool;
