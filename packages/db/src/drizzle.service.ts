import { createDrizzleClient, type DrizzleClient } from "./client";
import { UserModel } from "./models/user.model";
import type { CreateDrizzleClient } from "./types";

export class DrizzleDb {
  public readonly client: DrizzleClient;
  public readonly users: UserModel;

  constructor(options: CreateDrizzleClient) {
    this.client = createDrizzleClient(options);
    this.users = new UserModel(this.client);
  }

  /** Cheap liveness probe. Throws if the pool cannot reach the server. */
  async ping(): Promise<void> {
    await this.client.$client.query("select 1");
  }

  /** Drains and closes the underlying pg pool. */
  async close(): Promise<void> {
    await this.client.$client.end();
  }
}
