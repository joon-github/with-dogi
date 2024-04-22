import { Members } from 'src/routes/auth/entities/Members.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductReview } from './review.entity';

@Entity('LikeProductReview')
export class likeProductReview {
  @PrimaryGeneratedColumn()
  likeProductReviewId?: number;

  @ManyToOne(() => ProductReview, (review) => review)
  @JoinColumn({ name: 'reviewId' })
  review: ProductReview;

  @ManyToOne(() => Members, (user) => user)
  @JoinColumn({ name: 'userId' })
  user: Members;
}
