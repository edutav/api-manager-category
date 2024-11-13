import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Category } from '../../domain/category/entities/category.entity';

dotenv.config();

export const AppDataSource = new DataSource({
	type: 'postgres',
	host: 'postgres',
	port: 5432,
	username: 'postgres',
	password: 'postgres',
	database: 'api_dev',
	entities: [Category],
	migrations: ['src/infrastructure/migrations/*.ts'],
	synchronize: false,
});

export default AppDataSource;
