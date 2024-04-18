import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductQuestion } from '../../question/entities/productQuestion.entity';
import { Members } from 'src/routes/auth/entities/Members.entity';

@Entity('ProductAnswer')
export class ProductAnswer {
  @PrimaryGeneratedColumn()
  answerId?: number;

  @ManyToOne(() => ProductQuestion, (question) => question)
  @JoinColumn({ name: 'questionId' })
  question: ProductQuestion;

  @ManyToOne(() => Members, (members) => members)
  @JoinColumn({ name: 'userId' })
  user: Members;

  @Column({ type: 'text' })
  answerContent: string;
}
