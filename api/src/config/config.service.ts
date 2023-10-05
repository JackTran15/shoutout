import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

if (fs.existsSync('.env')) {
  dotenv.config({ path: '.env' });
}

@Injectable()
export class ConfigService {
  get<T>(key: string): T {
    return process.env[key] as T;
  }

  getMongoUri(): string {
    return this.get<string>('MONGODB_URI');
  }
}
