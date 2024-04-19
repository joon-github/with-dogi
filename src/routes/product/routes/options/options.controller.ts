import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { OptionsService } from './options.service';
import { AddOptionForProductDto } from './dto/addOptionForProductDto.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TokenPayload } from 'src/routes/auth/interfaces/token-payload.interface';
import { ResponesContainerDto } from 'src/global/dto/respones-container.dto';

@Controller('product/option')
@ApiTags('option')
export class OptionsController {
  constructor(private readonly optionsService: OptionsService) {}

  @Post(':productId')
  @ApiOperation({ summary: '옵션 추가' })
  async addOptionForProduct(
    @Body() addOptionForProductDto: AddOptionForProductDto,
    @Req() request: Request,
  ): Promise<ResponesContainerDto<null>> {
    const user = request['user'] as TokenPayload;
    await this.optionsService.addOptionForProduct(
      addOptionForProductDto,
      user.userId,
    );
    return {
      statusCode: 201,
      message: '옵션 추가 성공',
      data: null,
    };
  }

  @Patch(':optionId')
  @ApiOperation({ summary: '옵션 수정' })
  async update(
    @Param('optionId') optionId: number,
    @Body() updateOptionDto: UpdateOptionDto,
    @Req() request: Request,
  ): Promise<ResponesContainerDto<null>> {
    const user = request['user'] as TokenPayload;
    await this.optionsService.update(optionId, updateOptionDto, user.userId);
    return {
      statusCode: 200,
      message: '옵션 추가 성공',
      data: null,
    };
  }

  @Delete(':optionId')
  @ApiOperation({ summary: '옵션 삭제' })
  async remove(
    @Param('optionId') optionId: number,
    @Req() request: Request,
  ): Promise<ResponesContainerDto<null>> {
    const user = request['user'] as TokenPayload;
    await this.optionsService.deleteOption(optionId, user.userId);
    return {
      statusCode: 200,
      message: '옵션 삭제 성공',
      data: null,
    };
  }
}
