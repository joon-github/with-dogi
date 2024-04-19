import { Members } from 'src/routes/auth/entities/Members.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Option } from '../../options/entities/option.entity';

@Entity('ProductReview')
export class ProductReview {
  @PrimaryGeneratedColumn()
  reviewId?: number;

  @ManyToOne(() => Members, (user) => user)
  @JoinColumn({ name: 'userId' })
  user: Members;

  @ManyToOne(() => Option, (option) => option)
  @JoinColumn({ name: 'optionId' })
  option: Option;

  @Column()
  rating: number;

  @Column({ length: 100 })
  commnet: string;
}
