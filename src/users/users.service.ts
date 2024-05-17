import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDetailsService } from '../user-details/user-details.service';
import { RolesService } from '../roles/roles.service';
import { User } from './user.model';

@Injectable()
export class UsersService {
  private users: User[] = [];

  constructor(
    private readonly userDetailsService: UserDetailsService,
    private readonly rolesService: RolesService,
  ) {}

  findAll(): User[] {
    return this.users;
  }

  findOne(id: string): User {
    return this.users.find((user) => user.id === id);
  }

  create(createUserDto: CreateUserDto): User {
    const { name, userDetails, roleIds } = createUserDto;
    const newUserDetail = this.userDetailsService.create(userDetails);

    const roles = roleIds
      ? roleIds.map((roleId) => this.rolesService.findOne(roleId))
      : null;
    const newUser: User = {
      id: uuid(),
      name,
      userDetails: newUserDetail,
      ...(roles && { roles }),
    };
    this.users.push(newUser);
    return newUser;
  }

  update(id: string, updateUserDto: UpdateUserDto): User {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      return null;
    }
    const user = this.users[userIndex];

    if (updateUserDto.userDetails) {
      user.userDetails = {
        ...user.userDetails,
        ...updateUserDto.userDetails,
      };
      this.userDetailsService.update(user.userDetails.id, user.userDetails);
    }

    let updatedRoles = user.roles;
    if (updateUserDto.roleIds) {
      updatedRoles = updateUserDto.roleIds
        .map((roleId) => this.rolesService.findOne(roleId))
        .filter((role) => role !== undefined && role !== null);
    }

    const updatedUser = {
      ...user,
      ...updateUserDto,
      roles: updatedRoles,
      userDetails: user.userDetails,
    };
    delete updatedUser.roleIds;

    this.users[userIndex] = updatedUser;
    return this.users[userIndex];
  }

  delete(id: string): void {
    this.users = this.users.filter((user) => user.id !== id);
  }
}
