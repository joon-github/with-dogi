import { Request } from 'express';
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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { TokenPayload } from 'src/auth/interfaces/token-payload.interface';

import { ResponesContainerDto } from 'src/global/dto/respones-container.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Categories } from './entities/Categories.entity';

@Controller('categories')
@ApiTags('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: '카테고리 등록' })
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Req() request: Request,
  ): Promise<ResponesContainerDto<null>> {
    const user = request['user'] as TokenPayload;
    await this.categoriesService.create(createCategoryDto, user.user_id);
    return {
      statusCode: 201,
      message: '카테고리 등록 성공',
      data: null,
    };
  }

  @Get()
  @ApiOperation({ summary: '카테고리 조회' })
  async findAll(): Promise<ResponesContainerDto<Categories[]>> {
    const data = await this.categoriesService.findAll();
    return {
      statusCode: 200,
      message: '상품 전체 조회 성공',
      data: data,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
