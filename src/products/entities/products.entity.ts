import { Brand } from 'src/brand/entities/brand.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity('Products')
export class Products {
  @PrimaryGeneratedColumn()
  product_id: number;

  @Column({ unique: true })
  product_code: number;

  @ManyToOne(() => Brand, (brand) => brand.products)
  brand: Brand; // 이 필드를 위한 별도의 엔티티 정의가 필요할 수 있습니다.

  @Column({ length: 100 })
  product_name: string;

  @Column()
  category_detail_id: number; // 이 필드를 위한 별도의 엔티티 정의가 필요할 수 있습니다.

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  stock: number;

  @Column({ default: false })
  is_deleted: boolean;

  @Column({ default: 0 })
  sales_count: number;

  @Column({ type: 'datetime' })
  created_at: Date;

  @Column({ type: 'datetime', nullable: true })
  updated_at: Date;
}
