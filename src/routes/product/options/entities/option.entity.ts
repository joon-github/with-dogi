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
  categoryDetail: Product;

  @Column({ length: 20 })
  optionName: string;

  @Column()
  addPrice: number;
}
