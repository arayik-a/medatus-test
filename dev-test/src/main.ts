import * as passport from 'passport';
import * as session from 'express-session';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './modules/app/app.module';
import { ConfigService } from './modules/config/config.service';

const bootstrap = async () => {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.enableCors();

  app.useGlobalPipes(new ValidationPipe());

  app.use(
    session({
      resave: false,
      saveUninitialized: false,
      secret: config.get('SESSION_SECRET'),
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Medatus Test API')
    .setDescription(
      'Rest API that manages registration, login, and change password functionality',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api/docs', app, document);

  const PORT = config.get('APP_PORT') || 3000;

  await app.listen(PORT);

  logger.log(`App listening on port ${PORT}`);
};

bootstrap();
