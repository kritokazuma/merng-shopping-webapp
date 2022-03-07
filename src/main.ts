import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { graphqlUploadExpress } from 'graphql-upload';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

console.log(join(__dirname, '..', 'src', 'images'));

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(graphqlUploadExpress({ maxFieldSize: 10000000, maxFiles: 10 }));
  app.useStaticAssets(join(__dirname, '..', 'src', 'images'), {
    prefix: '/images/',
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT);
}
bootstrap();

console.log('hello world');
