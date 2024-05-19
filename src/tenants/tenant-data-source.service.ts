import { Injectable } from '@nestjs/common';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Tenant } from './tenant.entity';
import { createTenantDataSource } from './tenant-data-source';

@Injectable()
export class TenantDataSourceService {
  private dataSources: Map<string, DataSource> = new Map();

  async getTenantDataSource(tenant: Tenant): Promise<DataSource> {
    const connectionName = `tenant_${tenant.id}`;

    if (this.dataSources.has(connectionName)) {
      return this.dataSources.get(connectionName);
    }

    const tenantDataSource = createTenantDataSource({
      type: 'postgres',
      host: tenant.dbHost,
      port: tenant.dbPort,
      username: tenant.dbUsername,
      password: tenant.dbPassword,
      database: tenant.dbName,
    } as DataSourceOptions);

    await tenantDataSource.initialize();
    this.dataSources.set(connectionName, tenantDataSource);

    return tenantDataSource;
  }
}
