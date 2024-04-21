import { Members } from 'src/routes/auth/entities/Members.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderItem } from '../../order/entities/orderItem.entity';

@Entity('ProductReview')
export class ProductReview {
  @PrimaryGeneratedColumn()
  reviewId?: number;

  @ManyToOne(() => Members, (user) => user)
  @JoinColumn({ name: 'userId' })
  user: Members;

  @OneToOne(() => OrderItem)
  @JoinColumn({ name: 'orderDetailId' })
  orderItem: OrderItem;

  @Column()
  rating: number;

  @Column({ length: 100 })
  commnet: string;
}
