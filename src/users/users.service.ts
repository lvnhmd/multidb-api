import { Injectable, Scope, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDetails } from '../user-details/user-details.entity';
import { Role } from '../roles/role.entity';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { In } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class UsersService {
  private userRepository: Repository<User>;
  private userDetailsRepository: Repository<UserDetails>;
  private roleRepository: Repository<Role>;

  constructor(@Inject(REQUEST) private readonly request: Request) {
    this.setRepositories();
  }

  private setRepositories() {
    const dataSource = this.request['tenantDataSource'];
    this.userRepository = dataSource.getRepository(User);
    this.userDetailsRepository = dataSource.getRepository(UserDetails);
    this.roleRepository = dataSource.getRepository(Role);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({ relations: ['userDetails', 'roles'] });
  }

  async findOne(id: string): Promise<User> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['userDetails', 'roles'],
    });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { name, userDetails, roleIds } = createUserDto;
    const userDetailsEntity = this.userDetailsRepository.create(userDetails);
    await this.userDetailsRepository.save(userDetailsEntity);

    const roles = await this.roleRepository.findBy({
      id: In(roleIds),
    });

    const user = this.userRepository.create({
      name,
      userDetails: userDetailsEntity,
      roles,
    });
    return this.userRepository.save(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['userDetails', 'roles'],
    });

    if (updateUserDto.userDetails) {
      await this.userDetailsRepository.update(
        user.userDetails.id,
        updateUserDto.userDetails,
      );
    }

    if (updateUserDto.roleIds) {
      const roles = await this.roleRepository.findBy({
        id: In(updateUserDto.roleIds),
      });
      user.roles = roles;
    }

    if (updateUserDto.name) {
      user.name = updateUserDto.name;
    }

    await this.userRepository.save(user);
    return this.findOne(id);
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
