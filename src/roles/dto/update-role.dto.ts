import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateRoleDto {
  @ApiProperty({
    description: 'The name of the role',
    example: 'super user undo!',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;
}
