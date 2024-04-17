import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Members } from 'src/routes/auth/entities/Members.entity';
import { Option } from '../../options/entities/option.entity';

@Entity('ProductQuestion')
export class ProductQuestion {
  @PrimaryGeneratedColumn()
  questionId?: number;

  @ManyToOne(() => Option, (product) => product)
  @JoinColumn({ name: 'optionId' })
  option: Option;

  @ManyToOne(() => Members, (members) => members)
  @JoinColumn({ name: 'userId' })
  user: Members;

  @Column({ length: 100 })
  questionTitle: string;

  @Column({ type: 'text' })
  questionContent: string;
}
