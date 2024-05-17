import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './role.model';

@Injectable()
export class RolesService {
  private roles: Role[] = [];

  findAll(): Role[] {
    return this.roles;
  }

  findOne(id: string): Role {
    const role = this.roles.find((role) => role.id === id);
    console.log(`Found one role: ${JSON.stringify(role)}`);
    return role;
  }

  create(createRoleDto: CreateRoleDto): Role {
    const newRole: Role = {
      id: uuidv4(),
      ...createRoleDto,
    };
    this.roles.push(newRole);
    return newRole;
  }

  update(id: string, updateRoleDto: UpdateRoleDto): Role {
    const roleIndex = this.roles.findIndex((role) => role.id === id);
    if (roleIndex === -1) {
      return null;
    }
    this.roles[roleIndex] = { ...this.roles[roleIndex], ...updateRoleDto };
    return this.roles[roleIndex];
  }

  delete(id: string): void {
    this.roles = this.roles.filter((role) => role.id !== id);
  }
}
