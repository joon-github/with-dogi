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

@Controller('product/options')
@ApiTags('options')
export class OptionsController {
  constructor(private readonly optionsService: OptionsService) {}

  @Post(':productId')
  @ApiOperation({ summary: '옵션 추가' })
  async addOptionForProduct(
    @Body() addOptionForProductDto: AddOptionForProductDto,
    @Req() request: Request,
  ) {
    const user = request['user'] as TokenPayload;
    await this.optionsService.addOptionForProduct(
      addOptionForProductDto,
      user.userId,
    );
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOptionDto: UpdateOptionDto) {
    return this.optionsService.update(+id, updateOptionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.optionsService.remove(+id);
  }
}
