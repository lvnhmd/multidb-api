/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { Role } from './role.entity';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { NotFoundException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

describe('RolesService', () => {
  let service: RolesService;
  let roleRepository: Repository<Role>;
  let userRepository: Repository<User>;

  const mockRequest = {
    tenantDataSource: {
      getRepository: jest.fn(),
    },
  };

  const mockRoleRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    manager: {
      transaction: jest.fn(),
    },
  };

  const mockUserRepository = {};

  const mockRole: Role = {
    id: '1',
    name: 'Admin',
    users: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: getRepositoryToken(Role),
          useValue: mockRoleRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: REQUEST,
          useValue: mockRequest,
        },
      ],
    }).compile();

    service = await module.resolve<RolesService>(RolesService);
    roleRepository = module.get<Repository<Role>>(getRepositoryToken(Role));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));

    mockRequest.tenantDataSource.getRepository.mockImplementation((entity) => {
      if (entity === Role) return mockRoleRepository;
      if (entity === User) return mockUserRepository;
      return null;
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of roles', async () => {
      mockRoleRepository.find.mockResolvedValue([mockRole]);
      const result = await service.findAll();
      expect(result).toEqual([mockRole]);
      expect(mockRoleRepository.find).toHaveBeenCalledWith({
        relations: ['users'],
      });
    });
  });

  describe('findOne', () => {
    it('should return a single role', async () => {
      mockRoleRepository.findOne.mockResolvedValue(mockRole);
      const result = await service.findOne(mockRole.id);
      expect(result).toEqual(mockRole);
      expect(mockRoleRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockRole.id },
        relations: ['users'],
      });
    });

    it('should throw NotFoundException if role not found', async () => {
      mockRoleRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne('2')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a new role', async () => {
      const createRoleDto: CreateRoleDto = { name: 'User' };
      mockRoleRepository.create.mockReturnValue({ id: '1', ...createRoleDto });
      mockRoleRepository.save.mockResolvedValue({ id: '1', ...createRoleDto });

      const result = await service.create(createRoleDto);
      expect(result).toEqual({ id: '1', ...createRoleDto });
      expect(mockRoleRepository.create).toHaveBeenCalledWith(createRoleDto);
      expect(mockRoleRepository.save).toHaveBeenCalledWith({
        id: '1',
        ...createRoleDto,
      });
    });
  });

  describe('update', () => {
    it('should update and return the updated role', async () => {
      const updateRoleDto: UpdateRoleDto = { name: 'Super Admin' };
      mockRoleRepository.findOne.mockResolvedValue(mockRole);
      mockRoleRepository.update.mockResolvedValue({ affected: 1 });
      mockRoleRepository.save.mockResolvedValue({ id: '1', ...updateRoleDto });

      const result = await service.update(mockRole.id, updateRoleDto);
      // expect(result).toEqual({ id: mockRole.id, ...updateRoleDto });
      expect(mockRoleRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockRole.id },
        relations: ['users'],
      });
      expect(mockRoleRepository.update).toHaveBeenCalledWith(
        mockRole.id,
        updateRoleDto,
      );
    });

    it('should throw NotFoundException if role not found', async () => {
      mockRoleRepository.findOne.mockResolvedValue(null);
      const updateRoleDto: UpdateRoleDto = { name: 'Super Admin' };
      await expect(service.update('2', updateRoleDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete the role and return void', async () => {
      mockRoleRepository.findOne.mockResolvedValue(mockRole);
      mockRoleRepository.manager.transaction.mockImplementation(async (cb) =>
        cb({
          createQueryBuilder: () => ({
            delete: () => ({
              from: () => ({
                where: () => ({
                  execute: jest.fn().mockResolvedValue({}),
                }),
              }),
            }),
          }),
          delete: jest.fn().mockResolvedValue({}),
        }),
      );

      await service.delete(mockRole.id);
      expect(mockRoleRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockRole.id },
        relations: ['users'],
      });
      expect(mockRoleRepository.manager.transaction).toHaveBeenCalled();
    });

    it('should throw NotFoundException if role not found', async () => {
      mockRoleRepository.findOne.mockResolvedValue(null);
      await expect(service.delete('2')).rejects.toThrow(NotFoundException);
    });
  });
});
