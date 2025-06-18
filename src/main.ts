import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { VersioningType } from '@nestjs/common';

void bootstrap();

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.useGlobalPipes(
    new I18nValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(
    new I18nValidationExceptionFilter({
      detailedErrors: false,
    }),
  );

  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI });

  app.enableCors({});

  const config = new DocumentBuilder()
    .setTitle('Readly API')
    .setDescription(
      "Readly is a platform where readers track their reading journey, share book reviews and recommendations, and discover what's trending in the literary world. It combines personal book management with social features to connect book lovers everywhere.",
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  if (process.env.NODE_ENV !== 'production') {
    writeFileSync('./swagger-spec.json', JSON.stringify(document));
  }

  await app.listen(process.env.PORT as string, '0.0.0.0');
}
