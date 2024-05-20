import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './role.entity';
import { NotFoundException } from '@nestjs/common';

describe('RolesController', () => {
  let controller: RolesController;
  let service: RolesService;

  const mockRole: Role = {
    id: '1',
    name: 'Admin',
    users: [],
  };

  const mockRolesService = {
    findAll: jest.fn().mockResolvedValue([mockRole]),
    findOne: jest.fn().mockImplementation((id: string) => {
      if (id === mockRole.id) {
        return Promise.resolve(mockRole);
      }
      return Promise.resolve(null);
    }),
    create: jest.fn().mockImplementation((createRoleDto: CreateRoleDto) => {
      return Promise.resolve({ id: '1', ...createRoleDto });
    }),
    update: jest
      .fn()
      .mockImplementation((id: string, updateRoleDto: UpdateRoleDto) => {
        if (id === mockRole.id) {
          return Promise.resolve({ id, ...updateRoleDto });
        }
        return Promise.resolve(null);
      }),
    delete: jest.fn().mockImplementation((id: string) => {
      if (id === mockRole.id) {
        return Promise.resolve();
      }
      return Promise.resolve(null);
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        {
          provide: RolesService,
          useValue: mockRolesService,
        },
      ],
    }).compile();

    controller = module.get<RolesController>(RolesController);
    service = module.get<RolesService>(RolesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of roles', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([mockRole]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single role', async () => {
      const result = await controller.findOne(mockRole.id);
      expect(result).toEqual(mockRole);
      expect(service.findOne).toHaveBeenCalledWith(mockRole.id);
    });

    it('should throw NotFoundException if role not found', async () => {
      try {
        await controller.findOne('2');
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('create', () => {
    it('should create and return a new role', async () => {
      const createRoleDto: CreateRoleDto = { name: 'User' };
      const result = await controller.create(createRoleDto);
      expect(result).toEqual({ id: '1', ...createRoleDto });
      expect(service.create).toHaveBeenCalledWith(createRoleDto);
    });
  });

  describe('update', () => {
    it('should update and return the updated role', async () => {
      const updateRoleDto: UpdateRoleDto = { name: 'Super Admin' };
      const result = await controller.update(mockRole.id, updateRoleDto);
      expect(result).toEqual({ id: mockRole.id, ...updateRoleDto });
      expect(service.update).toHaveBeenCalledWith(mockRole.id, updateRoleDto);
    });

    it('should throw NotFoundException if role not found', async () => {
      const updateRoleDto: UpdateRoleDto = { name: 'Super Admin' };
      try {
        await controller.update('2', updateRoleDto);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('delete', () => {
    it('should delete the role and return void', async () => {
      const result = await controller.delete(mockRole.id);
      expect(result).toBeUndefined();
      expect(service.delete).toHaveBeenCalledWith(mockRole.id);
    });

    it('should throw NotFoundException if role not found', async () => {
      try {
        await controller.delete('2');
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
