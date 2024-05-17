export class CreateUserDto {
  name: string;
  userDetails: {
    address: string;
    phone: string;
  };
  roleIds: string[];
}
