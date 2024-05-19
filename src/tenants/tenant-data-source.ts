import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../users/user.entity';
import { UserDetails } from '../user-details/user-details.entity';
import { Role } from '../roles/role.entity';

export function createTenantDataSource(
  tenantConfig: DataSourceOptions,
): DataSource {
  return new DataSource({
    ...tenantConfig,
    entities: [User, UserDetails, Role],
    synchronize: true,
  });
}
