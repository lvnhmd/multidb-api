export class UpdateUserDto {
  name?: string;
  userDetails?: {
    address?: string;
    phone?: string;
  };
  roleIds?: string[];
}
