import { Injectable, Scope, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { User } from '../users/user.entity';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class RolesService {
  private roleRepository: Repository<Role>;
  private userRepository: Repository<User>;

  constructor(@Inject(REQUEST) private readonly request: Request) {
    this.setRepositories();
  }

  private setRepositories() {
    const dataSource = this.request['tenantDataSource'];
    this.roleRepository = dataSource.getRepository(Role);
    this.userRepository = dataSource.getRepository(User);
  }

  async findAll(): Promise<Role[]> {
    return this.roleRepository.find({
      relations: ['users'],
    });
  }

  async findOne(id: string): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['users'],
    });
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return role;
  }

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(role);
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    await this.findOne(id);
    await this.roleRepository.update(id, updateRoleDto);
    return this.findOne(id);
  }

  async delete(id: string): Promise<void> {
    await this.findOne(id);
    await this.roleRepository.manager.transaction(async (entityManager) => {
      await entityManager
        .createQueryBuilder()
        .delete()
        .from('user_roles_role')
        .where('roleId = :id', { id })
        .execute();

      await entityManager.delete(Role, id);
    });
  }
}
