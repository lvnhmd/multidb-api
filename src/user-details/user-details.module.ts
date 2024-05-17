import { Module } from '@nestjs/common';
import { UserDetailsService } from './user-details.service';
import { UserDetailsController } from './user-details.controller';

@Module({
  providers: [UserDetailsService],
  controllers: [UserDetailsController],
  exports: [UserDetailsService],
})
export class UserDetailsModule {}
