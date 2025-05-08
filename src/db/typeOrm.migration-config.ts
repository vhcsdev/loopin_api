import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { UsersEntity } from './entities/users.entity';

config();
const configService = new ConfigService();
const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: +(configService.get<string>('DB_PORT') ?? '5432'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_NAME'),
  entities: [UsersEntity],
  migrations: [__dirname + '/migrations/*.ts'],
  synchronize: false,
};
export default new DataSource(dataSourceOptions);
