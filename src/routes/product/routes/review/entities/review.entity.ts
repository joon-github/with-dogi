import { Members } from 'src/routes/auth/entities/Members.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderItem } from '../../order/entities/orderItem.entity';
import { likeProductReview } from './likeReview.entity';

@Entity('ProductReview')
export class ProductReview {
  @PrimaryGeneratedColumn()
  reviewId?: number;

  @ManyToOne(() => Members, (user) => user)
  @JoinColumn({ name: 'userId' })
  user: Members;

  @ManyToOne(() => OrderItem, (orderItem) => orderItem)
  @JoinColumn({ name: 'orderDetailId' })
  orderItem: OrderItem;

  @Column()
  rating: number;

  @Column({ length: 100 })
  comment: string;

  @OneToMany(() => likeProductReview, (likeReview) => likeReview.review)
  likeReview: likeProductReview[];
}
