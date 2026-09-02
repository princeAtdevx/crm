import type { ModuleMetadata } from '@nestjs/common';
import type { CreateDrizzleClient } from '@crm/db';

/** Everything `DrizzleDb` needs to open its pool. */
export type DatabaseModuleOptions = CreateDrizzleClient;

export interface DatabaseModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useFactory: (
    ...args: any[]
  ) => Promise<DatabaseModuleOptions> | DatabaseModuleOptions;
}
