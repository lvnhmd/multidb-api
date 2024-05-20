import {
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';

class UserDetailsDto {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  phone: string;
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @ValidateNested()
  @Type(() => UserDetailsDto)
  userDetails: UserDetailsDto;

  @IsArray()
  @IsUUID('4', { each: true })
  roleIds: string[];
}
