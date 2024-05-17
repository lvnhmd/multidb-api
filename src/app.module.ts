import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { UserDetailsModule } from './user-details/user-details.module';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [UsersModule, UserDetailsModule, RolesModule],
})
export class AppModule {}
