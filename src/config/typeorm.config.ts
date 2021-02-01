import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';

enum DbType {
  postgres = 'postgres',
}

interface DbConfig {
  type: DbType;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
}

const dbConfig: DbConfig = config.get('db');

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: dbConfig.type,
  host: process.env.RDS_HOSTNAME || dbConfig.host,
  port: parseInt(process.env.RDS_PORT) || dbConfig.port,
  username: process.env.RDS_USERNAME || dbConfig.username,
  password: process.env.RDS_PASSWORD || dbConfig.password,
  database: process.env.RDS_DB_NAME || dbConfig.database,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: !!process.env.TYPEORM_SYNC || dbConfig.synchronize,
};
