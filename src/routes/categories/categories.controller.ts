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
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { TokenPayload } from 'src/routes/auth/interfaces/token-payload.interface';

import { ResponesContainerDto } from 'src/global/dto/respones-container.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Categories } from './entities/Categories.entity';
import { FindCategoriesQueryDto } from './dto/find_all_categories.dto';

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
    await this.categoriesService.create(createCategoryDto, user.userId);
    return {
      statusCode: 201,
      message: '카테고리 등록 성공',
      data: null,
    };
  }

  @Get()
  @ApiOperation({ summary: '카테고리 조회' })
  @ApiQuery({ name: 'type', required: false, type: String })
  async findAll(
    @Query() queryDto: FindCategoriesQueryDto,
  ): Promise<ResponesContainerDto<Categories[]>> {
    const data = await this.categoriesService.findByType(queryDto.type);
    return {
      statusCode: 200,
      message: '카테고리 조회 성공',
      data: data,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: '카테고리 수정' })
  async update(
    @Param('id') id: string,
    @Req() request: Request,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<ResponesContainerDto<null>> {
    const user = request['user'] as TokenPayload;
    await this.categoriesService.update(+id, updateCategoryDto, user.userId);
    return {
      statusCode: 200,
      message: '카테고리 변경 성공',
      data: null,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: '카테고리 삭제' })
  async remove(
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<ResponesContainerDto<null>> {
    const user = request['user'] as TokenPayload;
    await this.categoriesService.remove(+id, user.userId);
    return {
      statusCode: 200,
      message: '카테고리 삭제 성공',
      data: null,
    };
  }
}
