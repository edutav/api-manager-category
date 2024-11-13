import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Category } from '../../domain/category/entities/category.entity';

dotenv.config();

export const AppDataSource = new DataSource({
	type: 'postgres',
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	entities: [Category],
	synchronize: true, // Para desenvolvimento; em produção, use migrations.
	// logging: true,
});

export default AppDataSource;
