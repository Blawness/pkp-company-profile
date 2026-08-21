/**
 * Drizzle client. Single source of truth for DB access across the app.
 *
 * Neon / serverless Postgres uses pgBouncer in front of the cluster, which
 * does not support Postgres prepared statements. The `prepare: false`
 * option on `postgres()` makes the driver send simple queries instead of
 * `PREPARE` / `EXECUTE`.
 */
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. See .env.example for the required format.",
  );
}

// `prepare: false` is required for Neon pooled connections (pgBouncer).
const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });
export type DB = typeof db;
