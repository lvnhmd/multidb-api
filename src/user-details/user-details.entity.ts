import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class UserDetails {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  address: string;

  @Column()
  phone: string;
}
