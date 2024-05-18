import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';
import { UserDetails } from './user-details/user-details.entity';
import { Role } from './roles/role.entity';
import { RolesModule } from './roles/roles.module';
import { SeederService } from './seeder.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([User, UserDetails, Role]),
    UsersModule,
    RolesModule,
  ],
  providers: [SeederService],
})
export class AppModule {}
