import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiHeader,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiHeader({
    name: 'x-tenant-name',
    description: 'Tenant name for multi-tenancy support',
    required: true,
    example: 'Tenant1',
  })
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return all users', type: [User] })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Get(':id')
  @ApiHeader({
    name: 'x-tenant-name',
    description: 'Tenant name for multi-tenancy support',
    required: true,
    example: 'Tenant1',
  })
  @ApiOperation({ summary: 'Get a user by id' })
  @ApiResponse({ status: 200, description: 'Return a single user', type: User })
  @ApiResponse({ status: 404, description: 'User with ID not found' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async findOne(@Param('id') id: string): Promise<User> {
    return await this.usersService.findOne(id);
  }

  @Post()
  @ApiHeader({
    name: 'x-tenant-name',
    description: 'Tenant name for multi-tenancy support',
    required: true,
    example: 'Tenant1',
  })
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been created',
    type: User,
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @ApiBody({ type: CreateUserDto })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(createUserDto);
  }

  @Patch(':id')
  @ApiHeader({
    name: 'x-tenant-name',
    description: 'Tenant name for multi-tenancy support',
    required: true,
    example: 'Tenant1',
  })
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been updated',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User with ID not found' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @ApiBody({ type: UpdateUserDto })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiHeader({
    name: 'x-tenant-name',
    description: 'Tenant name for multi-tenancy support',
    required: true,
    example: 'Tenant1',
  })
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 204, description: 'The user has been deleted' })
  @ApiResponse({ status: 404, description: 'User with ID not found' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    return await this.usersService.delete(id);
  }
}
