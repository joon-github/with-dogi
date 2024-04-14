import { IsOptional } from 'class-validator';
import { Brand } from 'src/routes/brand/entities/brand.entity';
import { Categories } from 'src/routes/categories/entities/Categories.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('Products')
export class Products {
  @PrimaryGeneratedColumn()
  productId?: number;

  @Column({ unique: true })
  productCode: string;

  @ManyToOne(() => Brand, (brand) => brand)
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @Column({ length: 100 })
  productName: string;

  @ManyToOne(() => Categories, (categories) => categories)
  @JoinColumn({ name: 'categoryId' })
  category: Categories;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'datetime' })
  createdAt?: Date;

  @Column({ type: 'datetime', nullable: true })
  @IsOptional()
  updatedAt?: Date;
}
