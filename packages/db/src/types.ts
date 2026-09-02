export interface CreateDrizzleClient {
  connectionString: string;
  maxConnections: number;
  idleTimeoutMillis: number;
}
