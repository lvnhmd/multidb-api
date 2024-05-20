import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDetails } from '../user-details/user-details.entity';
import { Role } from '../roles/role.entity';
import { NotFoundException } from '@nestjs/common';
import { In } from 'typeorm';
import { REQUEST } from '@nestjs/core';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;
  let userDetailsRepository: Repository<UserDetails>;
  let roleRepository: Repository<Role>;

  const mockRequest = {
    tenantDataSource: {
      getRepository: jest.fn(),
    },
  };

  const mockUserRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockUserDetailsRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockRoleRepository = {
    findBy: jest.fn(),
  };

  const mockUser: User = {
    id: '1',
    name: 'John Doe',
    userDetails: {
      id: '1',
      address: '123 Main St',
      phone: '123-456-7890',
    },
    roles: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(UserDetails),
          useValue: mockUserDetailsRepository,
        },
        {
          provide: getRepositoryToken(Role),
          useValue: mockRoleRepository,
        },
        {
          provide: REQUEST,
          useValue: mockRequest,
        },
      ],
    }).compile();

    // Use resolve method for scoped providers
    service = await module.resolve<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    userDetailsRepository = module.get<Repository<UserDetails>>(
      getRepositoryToken(UserDetails),
    );
    roleRepository = module.get<Repository<Role>>(getRepositoryToken(Role));

    // Mock the behavior of getRepository based on the tenantDataSource
    mockRequest.tenantDataSource.getRepository.mockImplementation((entity) => {
      if (entity === User) return mockUserRepository;
      if (entity === UserDetails) return mockUserDetailsRepository;
      if (entity === Role) return mockRoleRepository;
      return null;
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      mockUserRepository.find.mockResolvedValue([mockUser]);
      const result = await service.findAll();
      expect(result).toEqual([mockUser]);
      expect(userRepository.find).toHaveBeenCalledWith({
        relations: ['userDetails', 'roles'],
      });
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      const result = await service.findOne(mockUser.id);
      expect(result).toEqual(mockUser);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        relations: ['userDetails', 'roles'],
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne('2')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a new user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Jane Doe',
        userDetails: {
          address: '456 Elm St',
          phone: '987-654-3210',
        },
        roleIds: [],
      };
      mockUserDetailsRepository.create.mockReturnValue(
        createUserDto.userDetails,
      );
      mockUserDetailsRepository.save.mockResolvedValue(
        createUserDto.userDetails,
      );
      mockRoleRepository.findBy.mockResolvedValue([]);
      mockUserRepository.create.mockReturnValue({ id: '1', ...createUserDto });
      mockUserRepository.save.mockResolvedValue({ id: '1', ...createUserDto });

      const result = await service.create(createUserDto);
      expect(result).toEqual({ id: '1', ...createUserDto });
      expect(userDetailsRepository.create).toHaveBeenCalledWith(
        createUserDto.userDetails,
      );
      expect(userDetailsRepository.save).toHaveBeenCalledWith(
        createUserDto.userDetails,
      );
      expect(roleRepository.findBy).toHaveBeenCalledWith({
        id: In(createUserDto.roleIds),
      });
      expect(userRepository.create).toHaveBeenCalledWith({
        name: createUserDto.name,
        userDetails: createUserDto.userDetails,
        roles: [],
      });
      expect(userRepository.save).toHaveBeenCalledWith({
        id: '1',
        name: createUserDto.name,
        userDetails: createUserDto.userDetails,
        roles: [],
      });
    });
  });

  describe('update', () => {
    it('should update and return the updated user', async () => {
      const updateUserDto: UpdateUserDto = { name: 'John Doe Updated' };
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.save.mockResolvedValue({
        id: mockUser.id,
        ...updateUserDto,
      });

      const result = await service.update(mockUser.id, updateUserDto);
      expect(result).toEqual({ id: mockUser.id, ...updateUserDto });
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        relations: ['userDetails', 'roles'],
      });
      expect(userRepository.save).toHaveBeenCalledWith({
        ...mockUser,
        ...updateUserDto,
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      const updateUserDto: UpdateUserDto = { name: 'John Doe Updated' };
      await expect(service.update('2', updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete the user and return void', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.remove.mockResolvedValue(mockUser);

      await service.delete(mockUser.id);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        relations: ['userDetails', 'roles'],
      });
      expect(userRepository.remove).toHaveBeenCalledWith(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      await expect(service.delete('2')).rejects.toThrow(NotFoundException);
    });
  });
});
