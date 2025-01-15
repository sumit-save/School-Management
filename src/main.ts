import * as path from 'path';
import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestApplication>(AppModule);
  // Apply pipes for transform and validate data
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  // Serve static files from the "uploads" folder located at the root of the project
  app.useStaticAssets(path.join(process.cwd(), 'uploads'), { prefix: '/uploads/' });
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
