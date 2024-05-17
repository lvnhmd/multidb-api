import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { UserDetail } from './user-detail.model';
import { UserDetailsService } from './user-details.service';
import { CreateUserDetailDto } from './dto/create-user-detail.dto';
import { UpdateUserDetailDto } from './dto/update-user-detail.dto';

@Controller('user-details')
export class UserDetailsController {
  constructor(private readonly userDetailsService: UserDetailsService) {}

  @Get()
  findAll(): UserDetail[] {
    return this.userDetailsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): UserDetail {
    return this.userDetailsService.findOne(id);
  }

  @Post()
  create(@Body() createUserDetailDto: CreateUserDetailDto): UserDetail {
    return this.userDetailsService.create(createUserDetailDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDetailDto: UpdateUserDetailDto,
  ): UserDetail {
    return this.userDetailsService.update(id, updateUserDetailDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string): void {
    this.userDetailsService.delete(id);
  }
}
