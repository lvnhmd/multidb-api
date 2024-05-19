import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from './tenant.entity';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
  ) {}

  async clearTenants() {
    await this.tenantRepository.clear();
  }

  async createTenants(tenants: Partial<Tenant>[]) {
    const tenantEntities = tenants.map((tenant) =>
      this.tenantRepository.create(tenant),
    );
    await this.tenantRepository.save(tenantEntities);
  }

  async findAllTenants(): Promise<Tenant[]> {
    return this.tenantRepository.find();
  }

  async findTenantByName(name: string): Promise<Tenant> {
    return this.tenantRepository.findOne({ where: { name } });
  }
}
