import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';

class UserDetailsDto {
  @ApiProperty({
    description: 'The address of the user',
    example: '123 Old Oak Rd',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'The phone number of the user',
    example: '123-456-789',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;
}

export class CreateUserDto {
  @ApiProperty({
    description: 'The name of the user',
    example: 'Monty Bojangles',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'The user details', type: () => UserDetailsDto })
  @ValidateNested()
  @Type(() => UserDetailsDto)
  userDetails: UserDetailsDto;

  @ApiProperty({
    description: 'List of role IDs',
    type: [String],
    example: ['f47ac10b-58cc-4372-a567-0e02b2c3d479'],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  roleIds: string[];
}
