import { createDrizzleClient, type DrizzleClient } from "./client";
import { UserModel } from "./models/user.model";
import type { CreateDrizzleClient } from "./types";

declare global {
  var drizzle: DrizzleClient | undefined;
}

export class DrizzleDb {
  private drizzle: DrizzleClient;
  public readonly users: UserModel;

  constructor({
    connectionString,
    maxConnections,
    idleTimeoutMillis,
  }: CreateDrizzleClient) {
    if (!globalThis.drizzle) {
      const drizzleClient = createDrizzleClient({
        connectionString,
        maxConnections,
        idleTimeoutMillis,
      });

      globalThis.drizzle = drizzleClient;
    }

    this.drizzle = globalThis.drizzle;
    this.users = new UserModel(this.drizzle);
  }
}
