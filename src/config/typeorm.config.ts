import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { UserDetails } from '../user-details/user-details.entity';
import { Role } from '../roles/role.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'db',
  port: 5432,
  username: 'elvin',
  password: 'secret',
  database: 'bullhorn',
  entities: [User, UserDetails, Role],
  synchronize: true,
};
