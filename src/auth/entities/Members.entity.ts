import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserRole } from './user_role.enum';
import { Brand } from 'src/brand/entities/brand.entity';

@Entity('Members')
export class Members {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ length: 100 })
  password: string;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 20 })
  phone: string;

  @Column({ length: 200 })
  address: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.User,
  })
  role: UserRole;

  @Column({ length: 100, nullable: true })
  profile_photo: string;

  @Column({ type: 'date' })
  created_at: Date;

  @Column({ default: 500000 })
  point: number;

  @OneToMany(() => Brand, (brand) => brand.user)
  brands: Brand[];
}
