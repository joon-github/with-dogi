import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { ProductImageEnum } from '../enums/productImageType.enum';

@Entity('ProductImage')
export class ProductImage {
  @PrimaryGeneratedColumn()
  productImageId?: number;

  @Column()
  imageUrl: string;

  @Column()
  imageName: string;

  @ManyToOne(() => Product, (product) => product)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ length: 100 })
  productName: string;

  @Column({
    type: 'enum',
    enum: ProductImageEnum,
    default: ProductImageEnum.MAIN,
  })
  tpye: string;
}
