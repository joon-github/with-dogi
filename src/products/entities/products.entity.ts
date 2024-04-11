import { Brand } from 'src/brand/entities/brand.entity';
import { CategoriesDetail } from 'src/categories/detail/entities/CategoriesDetail.entity';
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
  product_id: number;

  @Column({ unique: true })
  product_code: string;

  @Column()
  brand_id: number;

  @ManyToOne(() => Brand, (brand) => brand)
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @Column({ length: 100 })
  product_name: string;

  @Column()
  category_detail_id: number;

  @ManyToOne(() => CategoriesDetail, (category) => category)
  @JoinColumn({ name: 'category_detail_id' })
  category_detail: CategoriesDetail;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  stock: number;

  @Column({ type: 'datetime' })
  created_at: Date;

  @Column({ type: 'datetime', nullable: true })
  updated_at: Date;
}
