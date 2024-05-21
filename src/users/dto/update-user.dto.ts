import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsArray,
  ValidateNested,
  IsUUID,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
class UpdateUserDetailsDto {
  @ApiProperty({
    example: '123 Old Oak Rd',
    description: 'The address of the user',
    required: false,
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({
    example: '123-456-789',
    description: 'The phone number of the user',
    required: false,
  })
  @IsString()
  @IsOptional()
  phone?: string;
}

export class UpdateUserDto {
  @ApiProperty({
    example: 'Monty Bojangles',
    description: 'The name of the user',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    type: UpdateUserDetailsDto,
    description: 'The details of the user',
    required: false,
  })
  @ValidateNested()
  @Type(() => UpdateUserDetailsDto)
  @IsOptional()
  userDetails?: UpdateUserDetailsDto;

  @ApiProperty({
    example: ['f47ac10b-58cc-4372-a567-0e02b2c3d479'],
    description: 'The UUIDs of the roles',
    isArray: true,
    required: false,
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  roleIds?: string[];
}
