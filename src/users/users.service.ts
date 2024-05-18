import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDetails } from '../user-details/user-details.entity';
import { Role } from '../roles/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserDetails)
    private readonly userDetailsRepository: Repository<UserDetails>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      relations: ['userDetails', 'roles'],
    });
  }

  async findOne(id: string): Promise<User> {
    return await this.userRepository.findOne({
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
    return await this.userRepository.save(user);
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
