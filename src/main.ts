import { NestFactory } from '@nestjs/core';
import { AppModule } from './routes/app.module';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './swagger';
import * as cookieParser from 'cookie-parser';
import { CustomExceptionFilter } from './global/filters/customExceptions.filter';
import { QueryFailedExceptionFilter } from './global/filters/queryFailedException.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  setupSwagger(app);
  app.useGlobalFilters(
    new CustomExceptionFilter(),
    new QueryFailedExceptionFilter(),
  );
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // true로 설정하면 요청 본문에서 정의된 속성만 허용하고 나머지는 제거합니다.
      transformOptions: {
        enableImplicitConversion: true, // 타입에 맞게 암묵적 변환 활성화
      },
      forbidNonWhitelisted: true, // 옵션과 함께 사용하며, 허용되지 않은 속성이 있으면 오류를 발생시킵니다.
      transform: true, //문자열로 전송된 숫자 데이터를 자동으로 숫자로 변환 합니다.
    }),
  );
  await app.listen(8000);
}
bootstrap();
