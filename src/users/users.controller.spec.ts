import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

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

  const mockUsersService = {
    findAll: jest.fn().mockResolvedValue([mockUser]),
    findOne: jest.fn().mockImplementation((id: string) => {
      if (id === mockUser.id) {
        return Promise.resolve(mockUser);
      }
      return Promise.resolve(null);
    }),
    create: jest.fn().mockImplementation((createUserDto: CreateUserDto) => {
      return Promise.resolve({ id: '1', ...createUserDto });
    }),
    update: jest
      .fn()
      .mockImplementation((id: string, updateUserDto: UpdateUserDto) => {
        if (id === mockUser.id) {
          return Promise.resolve({ id, ...updateUserDto });
        }
        return Promise.resolve(null);
      }),
    delete: jest.fn().mockImplementation((id: string) => {
      if (id === mockUser.id) {
        return Promise.resolve();
      }
      return Promise.resolve(null);
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([mockUser]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const result = await controller.findOne(mockUser.id);
      expect(result).toEqual(mockUser);
      expect(service.findOne).toHaveBeenCalledWith(mockUser.id);
    });

    it('should throw NotFoundException if user not found', async () => {
      try {
        await controller.findOne('2');
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
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
      const result = await controller.create(createUserDto);
      expect(result).toEqual({ id: '1', ...createUserDto });
      expect(service.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('update', () => {
    it('should update and return the updated user', async () => {
      const updateUserDto: UpdateUserDto = { name: 'John Doe Updated' };
      const result = await controller.update(mockUser.id, updateUserDto);
      expect(result).toEqual({ id: mockUser.id, ...updateUserDto });
      expect(service.update).toHaveBeenCalledWith(mockUser.id, updateUserDto);
    });

    it('should throw NotFoundException if user not found', async () => {
      const updateUserDto: UpdateUserDto = { name: 'John Doe Updated' };
      try {
        await controller.update('2', updateUserDto);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('delete', () => {
    it('should delete the user and return void', async () => {
      const result = await controller.delete(mockUser.id);
      expect(result).toBeUndefined();
      expect(service.delete).toHaveBeenCalledWith(mockUser.id);
    });

    it('should throw NotFoundException if user not found', async () => {
      try {
        await controller.delete('2');
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
