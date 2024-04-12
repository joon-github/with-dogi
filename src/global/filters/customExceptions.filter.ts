import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { AuthException } from '../../routes/Common/auth/exceptions/auth-exceptions';
import { ErrorResponesDto } from 'src/global/dto/respones-container.dto';

@Catch(AuthException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: AuthException, host: ArgumentsHost) {
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
