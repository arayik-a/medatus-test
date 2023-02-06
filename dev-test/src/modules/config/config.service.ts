import { parse } from 'dotenv';
import * as Joi from 'joi';
import * as fs from 'fs';

export interface EnvConfig {
  [key: string]: string;
}

export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor(filePath: string) {
    const config = parse(fs.readFileSync(filePath));

    this.envConfig = ConfigService.validateInput(config);
  }

  private static validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      APP_PORT: Joi.number(),
      SESSION_SALT: Joi.string().required(),
      SESSION_SECRET: Joi.string().required(),
      DB_URL: Joi.string().regex(/^mongodb/),
    });

    const { error, value: validatedEnvConfig } =
      envVarsSchema.validate(envConfig);

    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }

    return validatedEnvConfig;
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}
