import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users/user.entity';
import { UserDetails } from './user-details/user-details.entity';
import { Role } from './roles/role.entity';

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserDetails)
    private readonly userDetailsRepository: Repository<UserDetails>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async onModuleInit() {
    await this.clearDatabase();
    await this.seed();
  }

  async clearDatabase() {
    console.log('Clearing database tables...');
    await this.userRepository.delete({});
    await this.userDetailsRepository.delete({});
    await this.roleRepository.delete({});
    console.log('Database tables cleared.');
  }

  async seed() {
    console.log('Starting database seeding...');
    const roles = await this.createRoles();
    await this.createUsers(roles);

    console.log('Database seeding completed.');
  }

  async createRoles(): Promise<Role[]> {
    console.log('Creating roles...');
    const roleAdmin = this.roleRepository.create({ name: 'Admin' });
    const roleUser = this.roleRepository.create({ name: 'User' });
    const roles = await this.roleRepository.save([roleAdmin, roleUser]);
    console.log('Roles created:', roles);
    return roles;
  }

  async createUsers(roles: Role[]) {
    console.log('Creating users...');
    const adminRole = roles.find((role) => role.name === 'Admin');
    const userRole = roles.find((role) => role.name === 'User');

    const userDetails1 = this.userDetailsRepository.create({
      address: '123 Main St',
      phone: '123-456-7890',
    });
    const userDetails2 = this.userDetailsRepository.create({
      address: '456 Elm St',
      phone: '987-654-3210',
    });

    const user1 = this.userRepository.create({
      name: 'User One',
      userDetails: userDetails1,
      roles: [adminRole],
    });
    const user2 = this.userRepository.create({
      name: 'User Two',
      userDetails: userDetails2,
      roles: [userRole],
    });

    const users = await this.userRepository.save([user1, user2]);
    console.log('Users created:', users);
  }
}
