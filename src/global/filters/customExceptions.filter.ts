import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { ErrorResponesDto } from 'src/global/dto/respones-container.dto';
import { AuthException } from 'src/routes/auth/exceptions/auth-exceptions';
import { BrandException } from 'src/routes/brand/exceptions/brand-exceptions';
import { CategoryException } from 'src/routes/category/exceptions/category-exceptions';
import { ProductException } from 'src/routes/product/exceptions/product-exceptions';

@Catch(AuthException, ProductException, BrandException, CategoryException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const ResponesContaine: ErrorResponesDto = {
      statusCode: status,
      message: exception.message,
      error: 'Bad Request',
    };
    response.status(status).json(ResponesContaine);
  }
}
