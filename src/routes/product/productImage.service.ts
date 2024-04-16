import * as common from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductImage } from './entities/productImage.entity';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@common.Injectable()
export class ProductImageService {
  constructor(
    @InjectRepository(ProductImage)
    public productImageRepository: Repository<ProductImage>,
  ) {}

  public async addImages(product: Product, url: string) {
    const productImage = new ProductImage();
    productImage.product = product;
    productImage.imageName = 'test';
    productImage.type = 'main';
    productImage.imageUrl = url;
    return await this.productImageRepository.save(productImage);
  }
}
