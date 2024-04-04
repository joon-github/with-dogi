import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CategoriesDetail } from '../detail/entities/CategoriesDetail.entity';

@Entity('Categories')
export class Categories {
  @PrimaryGeneratedColumn()
  category_id: number;

  @Column({ length: 50 })
  category_name: string;

  @Column()
  type: number;

  @OneToMany(() => CategoriesDetail, (category) => category.category)
  products: CategoriesDetail[];
}
