import { Injectable, OnModuleInit } from '@nestjs/common';
import { TenantService } from './tenants/tenant.service';
import { TenantDataSourceService } from './tenants/tenant-data-source.service';
import { User } from './users/user.entity';
import { UserDetails } from './user-details/user-details.entity';
import { Role } from './roles/role.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(
    private readonly tenantService: TenantService,
    private readonly tenantDataSourceService: TenantDataSourceService,
  ) {}

  async onModuleInit() {
    await this.seedMasterDatabase();
    await this.seedTenantDatabases();
  }

  async seedMasterDatabase() {
    console.log('Seeding master database...');
    await this.clearMasterDatabase();
    await this.createTenants();
    console.log('Master database seeded.');
  }

  async clearMasterDatabase() {
    console.log('Clearing master database tables...');
    await this.tenantService.clearTenants();
    console.log('Master database tables cleared.');
  }

  async createTenants() {
    console.log('Creating tenants...');
    const tenant1 = {
      name: 'Tenant1',
      dbHost: 'tenant1_db',
      dbPort: 5432,
      dbUsername: 'tenant1',
      dbPassword: 'secret',
      dbName: 'tenant1_db',
    };

    const tenant2 = {
      name: 'Tenant2',
      dbHost: 'tenant2_db',
      dbPort: 5432,
      dbUsername: 'tenant2',
      dbPassword: 'secret',
      dbName: 'tenant2_db',
    };

    await this.tenantService.createTenants([tenant1, tenant2]);
    console.log('Tenants created.');
  }

  async seedTenantDatabases() {
    console.log('Seeding tenant databases...');
    const tenants = await this.tenantService.findAllTenants();

    for (const tenant of tenants) {
      const tenantDataSource =
        await this.tenantDataSourceService.getTenantDataSource(tenant);
      await this.clearTenantDatabase(tenantDataSource);
      await this.seedTenantDatabase(tenantDataSource);
    }
    console.log('Tenant databases seeded.');
  }

  async clearTenantDatabase(dataSource: DataSource) {
    const userRepository = dataSource.getRepository(User);
    const userDetailsRepository = dataSource.getRepository(UserDetails);
    const roleRepository = dataSource.getRepository(Role);

    console.log('Clearing tenant database tables...');
    await userRepository.query(`DELETE FROM "user" WHERE 1=1;`);
    await userDetailsRepository.query(`DELETE FROM "user_details" WHERE 1=1;`);
    await roleRepository.query(`DELETE FROM "role" WHERE 1=1;`);
    console.log('Tenant database tables cleared.');
  }

  async seedTenantDatabase(dataSource: DataSource) {
    const userRepository = dataSource.getRepository(User);
    const userDetailsRepository = dataSource.getRepository(UserDetails);
    const roleRepository = dataSource.getRepository(Role);

    console.log('Seeding tenant database...');

    const roleAdmin = roleRepository.create({ name: 'Admin' });
    const roleUser = roleRepository.create({ name: 'User' });
    const roles = await roleRepository.save([roleAdmin, roleUser]);

    const adminRole = roles.find((role) => role.name === 'Admin');
    const userRole = roles.find((role) => role.name === 'User');

    const userDetails1 = userDetailsRepository.create({
      address: '123 Main St',
      phone: '123-456-7890',
    });
    const userDetails2 = userDetailsRepository.create({
      address: '456 Elm St',
      phone: '987-654-3210',
    });

    const user1 = userRepository.create({
      name: 'User One',
      userDetails: userDetails1,
      roles: [adminRole],
    });
    const user2 = userRepository.create({
      name: 'User Two',
      userDetails: userDetails2,
      roles: [userRole],
    });

    await userRepository.save([user1, user2]);
    console.log('Tenant database seeded.');
  }
}
