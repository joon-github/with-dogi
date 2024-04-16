import {
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  applyDecorators,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';

export function CreateProduct() {
  return applyDecorators(
    UseInterceptors(FileInterceptor('images')),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          images: {
            type: 'array',
            items: {
              type: 'string',
              format: 'binary',
            },
          },
          brandId: { type: 'number' },
          productName: { type: 'string' },
          categoryId: { type: 'number' },
          price: { type: 'number' },
          description: { type: 'string' },
          options: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                optionName: { type: 'string' },
                addPrice: { type: 'number' },
                stock: { type: 'number' },
              },
            },
          },
        },
        required: ['productName', 'brandId', 'categoryId', 'price', 'options'],
      },
    }),
    UsePipes(new ValidationPipe({ transform: true })),
  );
}
