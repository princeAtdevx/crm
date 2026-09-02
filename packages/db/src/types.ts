export interface CreateDrizzleClient {
	connectionString: string;
	maxConnections?: number;
	idleTimeoutMillis?: number;
	/** Fail fast instead of queueing forever when the pool is unreachable. */
	connectionTimeoutMillis?: number;
}
