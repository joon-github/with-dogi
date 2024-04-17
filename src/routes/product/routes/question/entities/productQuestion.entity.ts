import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../../../entities/product.entity';
import { Members } from 'src/routes/auth/entities/Members.entity';

@Entity('ProductQuestion')
export class ProductQuestion {
  @PrimaryGeneratedColumn()
  questionId?: number;

  @ManyToOne(() => Product, (product) => product)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ManyToOne(() => Members, (members) => members)
  @JoinColumn({ name: 'userId' })
  user: Members;

  @Column({ length: 100 })
  questionTitle: string;

  @Column({ type: 'text' })
  questionContent: string;
}
