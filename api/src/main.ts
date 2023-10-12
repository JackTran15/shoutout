import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { isProduction } from './common/constants';
import { LoggerErrorInterceptor } from 'nestjs-pino';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const whitelist = process.env.WHITELIST?.split(',');

  const options = new DocumentBuilder()
    .setTitle('API documentation')
    .setDescription('The Shoutout Api documentation')
    .setVersion('1.0')
    .addTag('API')
    .build();

  const document = SwaggerModule.createDocument(app, options);

  if (!isProduction()) SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: whitelist,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  await app.listen(3000 || process.env.API_PORT, 'localhost');
}

bootstrap();
