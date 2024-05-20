import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDetails } from './user-details.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserDetails])],
})
export class UserDetailsModule {}
