import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponesContainerDto } from 'src/global/dto/respones-container.dto';
import { Products } from './entities/products.entity';

@Controller('products')
@ApiTags('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Get()
  @ApiOperation({ summary: '상품 전체 조회' })
  async findAll(): Promise<ResponesContainerDto<Products[]>> {
    const data = await this.productService.findAll();
    return {
      statusCode: 200,
      message: '상품 전체 조회 성공',
      data: data,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: '상품 단일 조회' })
  async findOne(
    @Param('id') id: string,
  ): Promise<ResponesContainerDto<Products>> {
    const data = await this.productService.findOne(+id);
    return {
      statusCode: 200,
      message: `${id}번 상품 조회 성공`,
      data: data,
    };
  }

  @Post()
  @ApiOperation({ summary: '상품 등록' })
  async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ResponesContainerDto<null>> {
    await this.productService.create(createProductDto);
    return {
      statusCode: 201,
      message: '상품 등록 성공',
      data: null,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: '상품 수정' })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ResponesContainerDto<null>> {
    await this.productService.update(+id, updateProductDto);
    return {
      statusCode: 200,
      message: `${id}번 상품 수정 성공`,
      data: null,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: '상품 삭제' })
  async remove(@Param('id') id: string): Promise<ResponesContainerDto<null>> {
    await this.productService.remove(+id);
    return {
      statusCode: 200,
      message: `${id}번 상품 삭제 성공`,
      data: null,
    };
  }
}
