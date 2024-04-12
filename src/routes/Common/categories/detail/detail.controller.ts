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
import { DetailService } from './detail.service';
import { CreateDetailDto } from './dto/create-detail.dto';
import { UpdateDetailDto } from './dto/update-detail.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TokenPayload } from 'src/routes/Common/auth/interfaces/token-payload.interface';
import { ResponesContainerDto } from 'src/global/dto/respones-container.dto';
import { CategoriesDetail } from './entities/CategoriesDetail.entity';

@Controller('categories/detail')
@ApiTags('categories/detail')
export class DetailController {
  constructor(private readonly detailService: DetailService) {}

  @Post()
  @ApiOperation({ summary: '카테고리 디테일 등록' })
  async create(
    @Body() createDetailDto: CreateDetailDto,
    @Req() request: Request,
  ): Promise<ResponesContainerDto<null>> {
    const user = request['user'] as TokenPayload;
    await this.detailService.create(createDetailDto, user.user_id);
    return {
      statusCode: 201,
      message: '카테고리 디테일 등록 성공',
      data: null,
    };
  }

  @Get(':category_id')
  @ApiOperation({ summary: '하위 카테고리 조회' })
  async findDetailByCategory(
    @Param('category_id') category_id: string,
    @Req() request: Request,
  ): Promise<ResponesContainerDto<CategoriesDetail[]>> {
    const user = request['user'] as TokenPayload;
    const data = await this.detailService.findDetailByCategory(
      +category_id,
      user.user_id,
    );
    return {
      statusCode: 200,
      message: '하위 카테고리 조회 성공',
      data: data,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: '카테고리 수정' })
  update(@Param('id') id: string, @Body() updateDetailDto: UpdateDetailDto) {
    return this.detailService.update(+id, updateDetailDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '카테고리 삭제' })
  remove(@Param('id') id: string) {
    return this.detailService.remove(+id);
  }
}
