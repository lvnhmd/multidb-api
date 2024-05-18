import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UserDetailsModule } from '../user-details/user-details.module';
import { RolesModule } from '../roles/roles.module';
import { UserDetails } from '../user-details/user-details.entity';
import { Role } from 'src/roles/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserDetails, Role]),
    UserDetailsModule,
    forwardRef(() => RolesModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
