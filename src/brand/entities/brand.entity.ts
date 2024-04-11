import { Members } from 'src/auth/entities/Members.entity';
import { Products } from 'src/products/entities/products.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity('Brand')
export class Brand {
  @PrimaryGeneratedColumn()
  brand_id: number;

  @Column({ length: 30, unique: true })
  brand_name: string;

  @ManyToOne(() => Members, (members) => members.brands)
  @JoinColumn({ name: 'user_id' })
  user: Members;

  @OneToMany(() => Products, (products) => products.brand)
  products: Products[];
}
