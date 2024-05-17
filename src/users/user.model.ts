import { UserDetail } from '../user-details/user-detail.model';
import { Role } from '../roles/role.model';

export interface User {
  id: string;
  name: string;
  userDetails: UserDetail;
  roles: Role[];
}
