import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { UserDetails } from '../user-details/user-details.entity';
import { Role } from '../roles/role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToOne(() => UserDetails, { cascade: true })
  @JoinColumn()
  userDetails: UserDetails;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable()
  roles: Role[];
}
