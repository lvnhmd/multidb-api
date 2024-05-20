import {
  IsString,
  IsOptional,
  ValidateNested,
  IsUUID,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

class UpdateUserDetailsDto {
  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  phone?: string;
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @ValidateNested()
  @Type(() => UpdateUserDetailsDto)
  @IsOptional()
  userDetails?: UpdateUserDetailsDto;

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  roleIds?: string[];
}
