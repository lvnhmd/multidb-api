import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDetails } from './user-details.entity';
import { CreateUserDetailDto } from './dto/create-user-detail.dto';
import { UpdateUserDetailDto } from './dto/update-user-detail.dto';

@Injectable()
export class UserDetailsService {
  constructor(
    @InjectRepository(UserDetails)
    private readonly userDetailsRepository: Repository<UserDetails>,
  ) {}

  async findAll(): Promise<UserDetails[]> {
    return await this.userDetailsRepository.find();
  }

  async findOne(id: string): Promise<UserDetails> {
    return await this.userDetailsRepository.findOne({ where: { id } });
  }

  async create(
    createUserDetailsDto: CreateUserDetailDto,
  ): Promise<UserDetails> {
    const userDetails = this.userDetailsRepository.create(createUserDetailsDto);
    return await this.userDetailsRepository.save(userDetails);
  }

  async update(
    id: string,
    updateUserDetailsDto: UpdateUserDetailDto,
  ): Promise<UserDetails> {
    await this.userDetailsRepository.update(id, updateUserDetailsDto);
    return await this.findOne(id);
  }

  async delete(id: string): Promise<void> {
    await this.userDetailsRepository.delete(id);
  }
}
