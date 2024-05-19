import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantService } from './tenant.service';
import { TenantDataSourceService } from './tenant-data-source.service';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(
    private readonly tenantService: TenantService,
    private readonly tenantDataSourceService: TenantDataSourceService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const tenantName = req.headers['x-tenant-name'] as string;
    if (!tenantName) {
      return res.status(400).send('Tenant name header is missing');
    }

    const tenant = await this.tenantService.findTenantByName(tenantName);
    if (!tenant) {
      return res.status(404).send('Tenant not found');
    }

    req['tenant'] = tenant;
    req['tenantDataSource'] =
      await this.tenantDataSourceService.getTenantDataSource(tenant);

    next();
  }
}
