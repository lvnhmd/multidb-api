import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserDetailsModule } from '../user-details/user-details.module';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [UserDetailsModule, RolesModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
