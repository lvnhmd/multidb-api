import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  dbHost: string;

  @Column()
  dbPort: number;

  @Column()
  dbUsername: string;

  @Column()
  dbPassword: string;

  @Column()
  dbName: string;
}
