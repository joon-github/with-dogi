import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { ProductService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ResponesContainerDto } from 'src/global/dto/respones-container.dto';
import { Products } from './entities/products.entity';
import { Request } from 'express';
import { FindAllProductsQueryDto } from './dto/find_all_product.dto';
import { TokenPayload } from 'src/auth/interfaces/token-payload.interface';

@Controller('products')
@ApiTags('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: '상품 전체 조회' })
  @ApiQuery({ name: 'user_id', required: false, type: Number })
  @ApiQuery({ name: 'category_detail_id', required: false, type: Number })
  @ApiQuery({ name: 'category_id', required: false, type: Number })
  @ApiQuery({ name: 'product_code', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  async findAll(
    @Query() queryDto: FindAllProductsQueryDto,
  ): Promise<ResponesContainerDto<Products[]>> {
    const data = await this.productService.findAll(
      queryDto.user_id,
      queryDto.category_detail_id,
      queryDto.category_id,
      queryDto.product_code,
      queryDto.limit,
      queryDto.offset,
    );
    return {
      statusCode: 200,
      message: '상품 전체 조회 성공',
      data: data.products,
      total: data.total,
      limit: queryDto.limit,
      offset: queryDto.offset,
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
    @Req() request: Request,
  ): Promise<ResponesContainerDto<null>> {
    const user = request['user'] as TokenPayload;
    await this.productService.create(createProductDto, user.user_id);
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
    @Req() request: Request,
  ): Promise<ResponesContainerDto<null>> {
    const user = request['user'] as TokenPayload;
    await this.productService.update(+id, updateProductDto, user.email);
    return {
      statusCode: 200,
      message: `${id}번 상품 수정 성공`,
      data: null,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: '상품 삭제' })
  async remove(
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<ResponesContainerDto<null>> {
    const user = request['user'] as TokenPayload;
    await this.productService.remove(+id, user.email);
    return {
      statusCode: 200,
      message: `${id}번 상품 삭제 성공`,
      data: null,
    };
  }
}
