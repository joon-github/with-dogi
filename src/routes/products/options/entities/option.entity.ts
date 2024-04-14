import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Products } from '../../entities/products.entity';

@Entity('ProductOptions')
export class Option {
  @PrimaryGeneratedColumn()
  ProductOptions?: number;

  @ManyToOne(() => Products, (products) => products)
  @JoinColumn({ name: 'products_id' })
  category_detail: Products;

  @Column({ length: 20 })
  option_name: string;

  @Column()
  add_price: number;
}
