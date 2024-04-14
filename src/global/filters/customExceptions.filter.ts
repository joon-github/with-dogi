import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorResponesDto } from 'src/global/dto/respones-container.dto';

@Catch(HttpException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
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
