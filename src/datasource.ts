import 'reflect-metadata';
import path from 'path';
import { DataSource } from 'typeorm';
import { Project } from './projects/project.entity';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: path.resolve(__dirname, '..', 'taskbridge.sqlite'),
  synchronize: true,
  logging: false,
  entities: [Project],
});
