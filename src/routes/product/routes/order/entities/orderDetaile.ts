import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Option } from '../../options/entities/option.entity';

@Entity('OrderDetail')
export class OrderDetail {
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
}
