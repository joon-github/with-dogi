import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserRole } from '../enums/user_role.enum';
import { Brand } from 'src/routes/product/routes/brand/entities/brand.entity';
import { ProductQuestion } from 'src/routes/product/routes/question/entities/productQuestion.entity';
import { ProductAnswer } from 'src/routes/product/routes/answer/entities/productAnswer.entity';
import { ProductReview } from 'src/routes/product/routes/review/entities/review.entity';
import { Cart } from 'src/routes/product/routes/cart/entities/cart.entity';
import { Order } from 'src/routes/product/routes/order/entities/order.entity';
import { likeProductReview } from 'src/routes/product/routes/review/entities/likeReview.entity';

@Entity('Members')
export class Members {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ length: 100 })
  password: string;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 20 })
  phone: string;

  @Column({ length: 200 })
  address: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.User,
  })
  role: string;

  @Column({ length: 100, nullable: true })
  profilePhoto: string;

  @Column({ type: 'date' })
  createdAt: Date;

  @Column({ default: 500000 })
  point: number;

  @OneToMany(() => Brand, (brand) => brand.user)
  brands: Brand[];

  @OneToMany(() => ProductQuestion, (question) => question.user)
  productQuestions?: ProductQuestion[];

  @OneToMany(() => ProductAnswer, (answer) => answer.question)
  answer: ProductAnswer[];

  @OneToMany(() => ProductReview, (review) => review.user)
  reviews: ProductReview[];

  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => likeProductReview, (likeReview) => likeReview.user)
  likeReview: likeProductReview[];
}
