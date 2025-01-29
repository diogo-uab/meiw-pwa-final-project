import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { config } from './config/env';
import { parseLogLevels } from './config/log-level';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: parseLogLevels(),
  });
  app.disable('x-powered-by');

  // Allow any origin for development
  if (!config.isProduction) {
    app.enableCors({
      allowedHeaders: '*',
      origin: '*',
      credentials: true,
    });
  }

  await app.listen(config.port ?? 3000);
}
bootstrap();
