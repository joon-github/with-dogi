import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  TreeChildren,
  TreeParent,
  JoinColumn,
} from 'typeorm';
import { CategoryType } from '../enums/category_type.enum';
import { IsOptional } from 'class-validator';

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

  @Column()
  @IsOptional()
  parentsCategoryId?: number;

  @TreeParent()
  @JoinColumn({ name: 'parentsCategoryId' })
  parent?: Category;

  @TreeChildren()
  children?: Category[];
}
