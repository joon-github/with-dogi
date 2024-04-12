import { Categories } from 'src/routes/categories/entities/Categories.entity';
import { Products } from 'src/routes/products/entities/products.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity('CategoriesDetail')
export class CategoriesDetail {
  @PrimaryGeneratedColumn()
  category_detail_id: number;

  @ManyToOne(() => Categories, (category) => category)
  @JoinColumn({ name: 'category_id' })
  category: Categories;

  @Column({ length: 50 })
  category_name: string;

  @OneToMany(() => Products, (products) => products.category_detail)
  products: Products[];
}