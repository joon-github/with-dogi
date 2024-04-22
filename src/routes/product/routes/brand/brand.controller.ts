import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { TokenPayload } from 'src/routes/auth/interfaces/token-payload.interface';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponesContainerDto } from 'src/global/dto/respones-container.dto';
import { Brand } from './entities/brand.entity';

@Controller('product/brand')
@ApiTags('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  @ApiOperation({ summary: '브랜드 등록' })
  async create(
    @Body() createBrandDto: CreateBrandDto,
    @Req() request: Request,
  ): Promise<ResponesContainerDto<null>> {
    const user = request['user'] as TokenPayload;
    this.brandService.create(createBrandDto, user.userId);
    return {
      statusCode: 201,
      message: '브랜드 등록 성공',
      data: null,
    };
  }

  @Get('my')
  @ApiOperation({ summary: '내 브랜드 조회' })
  async findAll(
    @Req() request: Request,
  ): Promise<ResponesContainerDto<Brand[]>> {
    const user = request['user'] as TokenPayload;
    const brandList = await this.brandService.findAll(user.userId);

    return {
      statusCode: 200,
      message: '브랜드 조회 성공',
      data: brandList,
    };
  }

  @Patch(':brandId')
  @ApiOperation({ summary: '브랜드 수정' })
  async update(
    @Param('brandId') brandId: number,
    @Body() updateBrandDto: UpdateBrandDto,
    @Req() request: Request,
  ): Promise<ResponesContainerDto<null>> {
    const user = request['user'] as TokenPayload;
    await this.brandService.update(brandId, updateBrandDto, user.userId);
    return {
      statusCode: 200,
      message: `${brandId}번 상품 수정 성공`,
      data: null,
    };
  }

  @Delete(':brandId')
  @ApiOperation({ summary: '브랜드 삭제' })
  async remove(
    @Param('brandId') brandId: number,
    @Req() request: Request,
  ): Promise<ResponesContainerDto<null>> {
    const user = request['user'] as TokenPayload;
    await this.brandService.remove(brandId, user.userId);
    return {
      statusCode: 200,
      message: `${brandId}번 브랜드 삭제 성공`,
      data: null,
    };
  }
}
