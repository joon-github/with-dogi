import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  TreeChildren,
  TreeParent,
  JoinColumn,
} from 'typeorm';
import { CategoriesType } from '../enums/categories_type.enum';

@Entity('Categories')
export class Categories {
  @PrimaryGeneratedColumn()
  categoryId?: number;

  @Column({ length: 50 })
  categoryName: string;

  @Column({
    type: 'enum',
    enum: CategoriesType,
    default: CategoriesType.Products,
  })
  type: string;

  @TreeParent()
  @JoinColumn({ name: 'parentsCategoryId' })
  parent?: Categories;

  @TreeChildren()
  children?: Categories[];
}
