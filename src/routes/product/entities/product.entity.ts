import { IsOptional } from 'class-validator';
import { Brand } from 'src/routes/brand/entities/brand.entity';
import { Category } from 'src/routes/category/entities/Category.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Option } from '../routes/options/entities/option.entity';
import { ProductImage } from './productImage.entity';

@Entity('Product')
export class Product {
  @PrimaryGeneratedColumn()
  productId?: number;

  @Column({ unique: true })
  productCode: string;

  @ManyToOne(() => Brand, (brand) => brand)
  @JoinColumn({ name: 'brandId' })
  brand: Brand;

  @Column({ length: 100 })
  productName: string;

  @ManyToOne(() => Category, (category) => category)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'datetime' })
  createdAt?: Date;

  @Column({ type: 'datetime', nullable: true })
  @IsOptional()
  updatedAt?: Date;

  @OneToMany(() => Option, (option) => option.product)
  options?: Option[];

  @OneToMany(() => ProductImage, (image) => image.product)
  images?: ProductImage[];
}
