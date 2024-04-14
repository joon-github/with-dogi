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
import { CategoryService } from './category.service';
import { TokenPayload } from 'src/routes/auth/interfaces/token-payload.interface';

import { ResponesContainerDto } from 'src/global/dto/respones-container.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/Category.entity';
import { FindCategoryQueryDto } from './dto/findAllCategory.dto';

@Controller('category')
@ApiTags('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiOperation({ summary: '카테고리 등록' })
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Req() request: Request,
  ): Promise<ResponesContainerDto<null>> {
    const user = request['user'] as TokenPayload;
    await this.categoryService.create(createCategoryDto, user.userId);
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
    @Query() queryDto: FindCategoryQueryDto,
  ): Promise<ResponesContainerDto<Category[]>> {
    const data = await this.categoryService.findByType(queryDto.type);
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
    await this.categoryService.update(+id, updateCategoryDto, user.userId);
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
    await this.categoryService.remove(+id, user.userId);
    return {
      statusCode: 200,
      message: '카테고리 삭제 성공',
      data: null,
    };
  }
}
