import * as winston from 'winston';
import { Module } from '@nestjs/common';
import { MongooseModule, MongooseModuleAsyncOptions } from '@nestjs/mongoose';

import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { UserModule } from '../user/user.module';
import { WinstonModule } from '../winston/winston.module';

import { AppService } from './app.service';
import { AppController } from './app.controller';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ({
          uri: configService.get('DB_URL'),
          useNewUrlParser: true,
          useUnifiedTopology: true,
        } as MongooseModuleAsyncOptions),
    }),
    WinstonModule.forRootAsync({
      useFactory: () => {
        return {
          level: 'info',
          format: winston.format.json(),
          defaultMeta: { service: 'user-service' },
          transports: [
            new winston.transports.Console({
              format: winston.format.simple(),
            }),
          ],
        };
      },
    }),
    ConfigModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
