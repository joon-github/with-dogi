import { Controller, Body, Param, Delete, Req, Post } from '@nestjs/common';
import { OptionsService } from './options.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TokenPayload } from 'src/routes/auth/interfaces/token-payload.interface';
import { ResponesContainerDto } from 'src/global/dto/respones-container.dto';
import { InsertOrUpdateDto } from './dto/insertOrUpdate.dto';
import { CreateProduct } from '../../decorator/CreateProduct';

@Controller('product/option')
@ApiTags('option')
export class OptionsController {
  constructor(private readonly optionsService: OptionsService) {}

  // @Post(':productId')
  // @ApiOperation({ summary: '옵션 추가' })
  // async addOptionForProduct(
  //   @Body() addOptionForProductDto: AddOptionForProductDto,
  //   @Req() request: Request,
  // ): Promise<ResponesContainerDto<null>> {
  //   const user = request['user'] as TokenPayload;
  //   await this.optionsService.addOptionForProduct(
  //     addOptionForProductDto,
  //     user.userId,
  //   );
  //   return {
  //     statusCode: 201,
  //     message: '옵션 추가 성공',
  //     data: null,
  //   };
  // }

  // @Patch(':optionId')
  // @ApiOperation({ summary: '옵션 수정' })
  // async update(
  //   @Param('optionId') optionId: number,
  //   @Body() updateOptionDto: UpdateOptionDto,
  //   @Req() request: Request,
  // ): Promise<ResponesContainerDto<null>> {
  //   const user = request['user'] as TokenPayload;
  //   await this.optionsService.update(optionId, updateOptionDto, user.userId);
  //   return {
  //     statusCode: 200,
  //     message: '옵션 추가 성공',
  //     data: null,
  //   };
  // }
  @Post(':productId')
  @ApiOperation({ summary: '옵션 수정' })
  @CreateProduct({
    schema: {
      type: 'object',
      properties: {
        options: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              optionName: { type: 'string' },
              addPrice: { type: 'number' },
              stock: { type: 'number' },
              file: {
                type: 'string',
                format: 'binary',
              },
            },
          },
        },
      },
      required: ['options'],
    },
  })
  // @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        options: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              optionName: { type: 'string' },
              addPrice: { type: 'number' },
              stock: { type: 'number' },
              file: {
                type: 'string',
                format: 'binary',
              },
            },
          },
        },
      },
      required: ['options'],
    },
  })
  // @UsePipes(new ValidationPipe({ transform: true }))
  async insertOrupdate(
    @Body() insertOrUpdateOptionDto: InsertOrUpdateDto,
    @Param('productId') productId: number,
    @Req() request: Request,
  ): Promise<ResponesContainerDto<null>> {
    const user = request['user'] as TokenPayload;
    await this.optionsService.insertOrUpdate(
      insertOrUpdateOptionDto.options,
      productId,
      user.userId,
    );
    return {
      statusCode: 200,
      message: '옵션 추가 or 수정 성공',
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
