import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import type { CreateDrizzleClient } from "./types";

export function createDrizzleClient({
  connectionString,
  maxConnections = 10,
  idleTimeoutMillis = 30000,
}: CreateDrizzleClient) {
  const pool = new Pool({
    connectionString,
    max: maxConnections,
    idleTimeoutMillis,
  });

  const db = drizzle({ client: pool });

  return db;
}

export type DrizzleClient = ReturnType<typeof createDrizzleClient>;
