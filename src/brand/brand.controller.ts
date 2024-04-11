import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { TokenPayload } from 'src/auth/interfaces/token-payload.interface';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ResponesContainerDto } from 'src/global/dto/respones-container.dto';
import { FindAllBrandQueryDto } from './dto/find_all_brand.dto';
import { Brand } from './entities/brand.entity';

@Controller('brand')
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
    this.brandService.create(createBrandDto, user.user_id);
    return {
      statusCode: 201,
      message: '상품 등록 성공',
      data: null,
    };
  }

  @Get()
  @ApiOperation({ summary: '브랜드 조회' })
  @ApiQuery({ name: 'user_id', required: false, type: Number })
  @ApiQuery({ name: 'brand_name', required: false, type: String })
  async findAll(
    @Query() queryDto: FindAllBrandQueryDto,
  ): Promise<ResponesContainerDto<Brand[]>> {
    const brandList = await this.brandService.findAll(
      queryDto.brand_name,
      queryDto.user_id,
    );

    return {
      statusCode: 200,
      message: '브랜드 조회 성공',
      data: brandList,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brandService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandService.update(+id, updateBrandDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.brandService.remove(+id);
  }
}
