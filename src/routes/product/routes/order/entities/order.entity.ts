import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Members } from 'src/routes/auth/entities/Members.entity';
import { OrderItem } from './orderItem.entity';

@Entity('Order')
export class Order {
  @PrimaryGeneratedColumn()
  orderId?: number;

  @Column()
  orderNumber: string;

  @ManyToOne(() => Members, (member) => member)
  @JoinColumn({ name: 'userId' })
  user: Members;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  OrderItems?: OrderItem[];
}
