import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { UsersModule } from './users/users.module';
import { UserDetailsModule } from './user-details/user-details.module';
import { RolesModule } from './roles/roles.module';
import { TenantModule } from './tenants/tenant.module';
import { TenantMiddleware } from './tenants/tenant.middleware';
import { TenantDataSourceService } from './tenants/tenant-data-source.service';
import { SeederService } from './seeder.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    UsersModule,
    UserDetailsModule,
    RolesModule,
    TenantModule,
  ],
  providers: [TenantDataSourceService, SeederService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
