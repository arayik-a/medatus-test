import { Logger } from 'winston';
import { Injectable, Inject } from '@nestjs/common';

import { ConfigService } from '../config/config.service';

@Injectable()
export class AppService {
  constructor(
    private config: ConfigService,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  root(): string {
    const APP_PORT = this.config.get('APP_PORT');
    const info = `App listening on port ${APP_PORT}`;

    this.logger.info(info);

    return info;
  }
}
