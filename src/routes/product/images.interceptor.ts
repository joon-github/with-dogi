import { Observable } from 'rxjs';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

@Injectable()
export class ImagesInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const files = request.files as Array<Express.Multer.File>;
    const body = request.body;

    // files 배열과 body에서 메타데이터를 조합하여 새로운 images 배열 생성
    request.images = files
      ? files.map((file, index) => ({
          file: file,
          seq: body.seq[index],
          imageName: body.imageNames[index],
        }))
      : [];

    return next.handle();
  }
}
