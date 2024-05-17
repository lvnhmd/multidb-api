import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { Role } from './role.model';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  findAll(): Role[] {
    return this.rolesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Role {
    return this.rolesService.findOne(id);
  }

  @Post()
  create(@Body() createRoleDto: CreateRoleDto): Role {
    return this.rolesService.create(createRoleDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto): Role {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string): void {
    this.rolesService.delete(id);
  }
}
