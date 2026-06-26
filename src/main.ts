import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security Hardening (Helmet + CORS)
  app.use(helmet());
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global pipes
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  // Global filter
  app.useGlobalFilters(new HttpExceptionFilter());
  // Global interceptor
  app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Farm to Platform API')
    .setDescription('The Farm to Platform API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = parseInt(process.env.PORT || '5003', 10);
  await app.listen(port);
  console.log(`🚀 Application listening on port ${port}`);
}
bootstrap();
