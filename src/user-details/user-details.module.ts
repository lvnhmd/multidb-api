import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDetailsService } from './user-details.service';
import { UserDetails } from './user-details.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserDetails])],
  providers: [UserDetailsService],
  exports: [UserDetailsService],
})
export class UserDetailsModule {}
