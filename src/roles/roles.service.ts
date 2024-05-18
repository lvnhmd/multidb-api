import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { User } from '../users/user.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Role[]> {
    return this.roleRepository.find({
      relations: ['users'],
    });
  }

  async findOne(id: string): Promise<Role> {
    return this.roleRepository.findOne({ where: { id }, relations: ['users'] });
  }

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(role);
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    await this.roleRepository.update(id, updateRoleDto);
    return this.findOne(id);
  }

  async delete(id: string): Promise<void> {
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
