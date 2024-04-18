import { Members } from 'src/routes/auth/entities/Members.entity';
import { Product } from 'src/routes/product/entities/product.entity';
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

  @OneToMany(() => Product, (product) => product.brand)
  product: Product[];
}
