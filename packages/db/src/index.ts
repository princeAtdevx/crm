export { DrizzleDb } from "./drizzle.service";
export { createDrizzleClient, type DrizzleClient } from "./client";
export type { CreateDrizzleClient } from "./types";

export { Model } from "./models/base.model";
export { UserModel } from "./models/user.model";

export * as schema from "./schema/schema";
export { UserTable } from "./schema/schema";

// Re-exported so consumers can build queries without taking their own
// `drizzle-orm` dependency (which could drift from the version used here).
export { and, asc, desc, eq, inArray, or, sql } from "drizzle-orm";
