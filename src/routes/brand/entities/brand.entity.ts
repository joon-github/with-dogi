import { Members } from 'src/routes/auth/entities/Members.entity';
import { Products } from 'src/routes/products/entities/products.entity';
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
  brandId: number;

  @Column({ length: 30, unique: true })
  brandName: string;

  @ManyToOne(() => Members, (members) => members.brands)
  @JoinColumn({ name: 'userId' })
  user: Members;

  @OneToMany(() => Products, (products) => products.brand)
  products: Products[];
}
