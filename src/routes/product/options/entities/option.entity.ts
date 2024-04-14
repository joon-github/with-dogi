import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../../entities/product.entity';

@Entity('ProductOptions')
export class Option {
  @PrimaryGeneratedColumn()
  ProductOptions?: number;

  @ManyToOne(() => Product, (product) => product)
  @JoinColumn({ name: 'productId' })
  category_detail: Product;

  @Column({ length: 20 })
  option_name: string;

  @Column()
  add_price: number;
}
