import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantService } from './tenant.service';
import { TenantDataSourceService } from './tenant-data-source.service';
import { Tenant } from './tenant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant])],
  providers: [TenantService, TenantDataSourceService],
  exports: [TenantService, TenantDataSourceService],
})
export class TenantModule {}
