import { Injectable } from '@nestjs/common';
// Value import, NOT `import type` — see database.health.ts.
import { DrizzleDb } from '@crm/db';

@Injectable()
export class AppService {
  constructor(private readonly db: DrizzleDb) {}

  getHello(): string {
    return 'Hello World!';
  }

  getUserById(id: string) {
    return this.db.users.getUserById(id);
  }
}
