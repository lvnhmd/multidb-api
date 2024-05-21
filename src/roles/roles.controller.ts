import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Role } from './role.entity';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiHeader,
} from '@nestjs/swagger';
@ApiTags('roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @ApiHeader({
    name: 'x-tenant-name',
    description: 'Tenant name for multi-tenancy support',
    required: true,
    example: 'Tenant1',
  })
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({ status: 200, description: 'Return all roles', type: [Role] })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async findAll(): Promise<Role[]> {
    return await this.rolesService.findAll();
  }

  @Get(':id')
  @ApiHeader({
    name: 'x-tenant-name',
    description: 'Tenant name for multi-tenancy support',
    required: true,
    example: 'Tenant1',
  })
  @ApiOperation({ summary: 'Get a role by id' })
  @ApiResponse({ status: 200, description: 'Return a single role', type: Role })
  @ApiResponse({ status: 404, description: 'Role with ID not found' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async findOne(@Param('id') id: string): Promise<Role> {
    return await this.rolesService.findOne(id);
  }

  @Post()
  @ApiHeader({
    name: 'x-tenant-name',
    description: 'Tenant name for multi-tenancy support',
    required: true,
    example: 'Tenant1',
  })
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({
    status: 201,
    description: 'The role has been created',
    type: Role,
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @ApiBody({ type: CreateRoleDto })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return await this.rolesService.create(createRoleDto);
  }

  @Patch(':id')
  @ApiHeader({
    name: 'x-tenant-name',
    description: 'Tenant name for multi-tenancy support',
    required: true,
    example: 'Tenant1',
  })
  @ApiOperation({ summary: 'Update a role' })
  @ApiResponse({
    status: 200,
    description: 'The role has been updated',
    type: Role,
  })
  @ApiResponse({ status: 404, description: 'Role with ID not found' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @ApiBody({ type: UpdateRoleDto })
  async update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<Role> {
    return await this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @ApiHeader({
    name: 'x-tenant-name',
    description: 'Tenant name for multi-tenancy support',
    required: true,
    example: 'Tenant1',
  })
  @ApiOperation({ summary: 'Delete a role' })
  @ApiResponse({ status: 204, description: 'The role has been deleted' })
  @ApiResponse({ status: 404, description: 'Role with ID not found' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    return await this.rolesService.delete(id);
  }
}
