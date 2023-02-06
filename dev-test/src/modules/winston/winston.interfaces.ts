import { LoggerOptions } from 'winston';
import { ModuleMetadata } from '@nestjs/common/interfaces';

export type WinstonModuleOptions = LoggerOptions;

export interface WinstonModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (
    ...args: any[]
  ) => Promise<WinstonModuleOptions> | WinstonModuleOptions;

  inject?: any[];
}
