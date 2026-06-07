import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggerMiddleware } from './common/middleware/logger.middleware';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Global pipes
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  // Global filter
  app.useGlobalFilters(new HttpExceptionFilter());
  // Global interceptor
  app.useGlobalInterceptors(new TransformInterceptor());
  // Logger middleware
  // LoggerMiddleware registration moved to AppModule (Nest best practice)

  await app.listen(3000);
  console.log('🚀 Application listening on port 3000');
}
bootstrap();
