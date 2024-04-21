import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Option } from '../../options/entities/option.entity';
import { ProductReview } from '../../review/entities/review.entity';

@Entity('OrderItem')
export class OrderItem {
  @PrimaryGeneratedColumn()
  orderDetailId?: number;

  @ManyToOne(() => Order, (order) => order)
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @ManyToOne(() => Option, (option) => option)
  @JoinColumn({ name: 'optionId' })
  option: Option;

  @Column()
  quantity: number;

  @Column()
  price: number;

  @OneToOne(() => ProductReview)
  review: ProductReview;
}
