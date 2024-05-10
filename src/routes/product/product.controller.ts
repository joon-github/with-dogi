import { Request } from 'express';
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
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { TokenPayload } from 'src/routes/auth/interfaces/token-payload.interface';

import { ResponesContainerDto } from 'src/global/dto/respones-container.dto';
import { FindAllProductQueryDto } from './dto/findAllProduct.dto';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { CreateProduct } from './decorator/CreateProduct';

@Controller('product')
@ApiTags('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: '상품 전체 조회' })
  @ApiQuery({ name: 'categoryId', required: false, type: Number })
  @ApiQuery({ name: 'productCode', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  async findAll(
    @Query() queryDto: FindAllProductQueryDto,
  ): Promise<ResponesContainerDto<Product[]>> {
    const data = await this.productService.findAll(
      queryDto.categoryId,
      queryDto.productCode,
      queryDto.limit,
      queryDto.offset,
    );
    return {
      statusCode: 200,
      message: '상품 전체 조회 성공',
      data: data.product,
      total: data.total,
      limit: queryDto.limit,
      offset: queryDto.offset,
    };
  }

  @Get('my')
  @ApiOperation({ summary: '내 상품 조회' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  async findMyProduct(
    @Query() queryDto: FindAllProductQueryDto,
    @Req() request: Request,
  ): Promise<ResponesContainerDto<Product[]>> {
    const user = request['user'] as TokenPayload;
    const data = await this.productService.findMyProduct(
      queryDto.categoryId,
      queryDto.productCode,
      queryDto.limit,
      queryDto.offset,
      user.userId,
    );
    return {
      statusCode: 200,
      message: '내 상품 조회 성공',
      data: data.product,
      total: data.total,
      limit: queryDto.limit,
      offset: queryDto.offset,
    };
  }

  @Get(':productId')
  @ApiOperation({ summary: '상품 단일 조회' })
  async findOne(
    @Param('productId') productId: number,
  ): Promise<ResponesContainerDto<Product>> {
    const data = await this.productService.findOne(productId);
    return {
      statusCode: 200,
      message: `${productId}번 상품 조회 성공`,
      data: data,
    };
  }

  // 내 상품인지 체크
  @Get('check_owner/:productId')
  @ApiOperation({ summary: '내 상품인지 체크' })
  async findOneMyProduct(
    @Param('productId') productId: number,
    @Req() request: Request,
  ): Promise<ResponesContainerDto<boolean>> {
    const user = request['user'] as TokenPayload;
    const data = await this.productService.checkMyProduct(
      productId,
      user.userId,
    );
    return {
      statusCode: 200,
      message: `${productId}번 상품인지 체크 성공`,
      data: data,
    };
  }

  @Post()
  @ApiOperation({
    summary:
      '상품 등록 (스웨거 multipart/form-data 데이터 표현 한계로 테스트 불가능. 클라이언트에서 테스트 진행할것)',
  })
  @CreateProduct()
  async create(
    @Body() createProductDto: CreateProductDto,
    @Req() request: Request,
  ): Promise<ResponesContainerDto<null>> {
    const user = request['user'] as TokenPayload;
    await this.productService.create(createProductDto, user.userId);
    return {
      statusCode: 201,
      message: '상품 등록 성공',
      data: null,
    };
  }

  @Patch(':productId')
  @ApiOperation({ summary: '상품 수정' })
  async update(
    @Param('productId') productId: number,
    @Body() updateProductDto: UpdateProductDto,
    @Req() request: Request,
  ): Promise<ResponesContainerDto<null>> {
    const user = request['user'] as TokenPayload;
    await this.productService.update(productId, updateProductDto, user.userId);
    return {
      statusCode: 200,
      message: `${productId}번 상품 수정 성공`,
      data: null,
    };
  }

  @Delete(':productId')
  @ApiOperation({ summary: '상품 삭제' })
  async remove(
    @Param('productId') productId: number,
    @Req() request: Request,
  ): Promise<ResponesContainerDto<null>> {
    const user = request['user'] as TokenPayload;
    await this.productService.remove(productId, user.userId);
    return {
      statusCode: 200,
      message: `${productId}번 상품 삭제 성공`,
      data: null,
    };
  }
}
