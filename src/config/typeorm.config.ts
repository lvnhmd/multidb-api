import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Tenant } from '../tenants/tenant.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  // host: 'master_db',
  host: 'localhost',
  port: 5432,
  username: 'master',
  password: 'secret',
  database: 'master_db',
  entities: [Tenant],
  synchronize: true,
};
