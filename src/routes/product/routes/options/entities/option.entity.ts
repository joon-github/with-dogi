import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../../../entities/product.entity';
import { ProductQuestion } from '../../question/entities/productQuestion.entity';
import { ProductReview } from '../../review/entities/review.entity';
import { Cart } from '../../cart/entities/cart.entity';
import { OrderDetail } from '../../order/entities/orderDetaile';

@Entity('ProductOptions')
export class Option {
  @PrimaryGeneratedColumn()
  optionId?: number;

  @ManyToOne(() => Product, (product) => product)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ length: 20 })
  optionName: string;

  @Column()
  addPrice: number;

  @Column()
  stock: number;

  @OneToMany(() => ProductQuestion, (question) => question.option)
  productQuestions?: ProductQuestion[];

  @OneToMany(() => ProductReview, (review) => review.option)
  reviews: ProductReview[];

  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];

  @OneToMany(() => OrderDetail, (cart) => cart.option)
  orderDetails: OrderDetail[];
}
