import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  TreeChildren,
  TreeParent,
  JoinColumn,
} from 'typeorm';
import { CategoryType } from '../enums/category_type.enum';

@Entity('Category')
export class Category {
  @PrimaryGeneratedColumn()
  categoryId?: number;

  @Column({ length: 50 })
  categoryName: string;

  @Column({
    type: 'enum',
    enum: CategoryType,
    default: CategoryType.Product,
  })
  type: string;

  @TreeParent()
  @JoinColumn({ name: 'parentsCategoryId' })
  parent?: Category;

  @TreeChildren()
  children?: Category[];
}
