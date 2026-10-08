import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config';
import { Logger } from '@nestjs/common';
import { log } from 'console';

async function bootstrap() {
  const logger = new Logger()
  const app = await NestFactory.create(AppModule);
  await app.listen(envs.port);
  logger.log('Orders microservice corriendo en el puerto: ' + envs.port)
}
void bootstrap();
