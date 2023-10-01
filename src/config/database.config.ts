import { SequelizeModuleOptions } from '@nestjs/sequelize';

import * as dotenv from 'dotenv';

dotenv.config();

export const DbConfig: SequelizeModuleOptions = {
  dialect: 'postgres',
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  synchronize: true, //change later
  autoLoadModels: true,
  //   models: ['**/*.entity.js'],
};
