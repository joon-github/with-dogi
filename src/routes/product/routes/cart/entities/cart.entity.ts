import { Members } from 'src/routes/auth/entities/Members.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Option } from '../../options/entities/option.entity';

@Entity('Cart')
export class Cart {
  @PrimaryGeneratedColumn()
  cartId?: number;

  @ManyToOne(() => Members, (user) => user)
  @JoinColumn({ name: 'userId' })
  user: Members;

  @ManyToOne(() => Option, (option) => option)
  @JoinColumn({ name: 'optionId' })
  option: Option;

  @Column()
  quantity: number;
}
