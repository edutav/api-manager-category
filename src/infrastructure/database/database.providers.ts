import { ConfigService } from '@nestjs/config';
import { Category } from '../../domain/category/entities/category.entity';
import { DataSource } from 'typeorm';

export const databaseProviders = [
	{
		provide: 'DATA_SOURCE',
		inject: [ConfigService],
		useFactory: async (configService: ConfigService) => {
			const dataSource = new DataSource({
				type: 'postgres',
				host: configService.get<string>('DB_HOST'),
				port: configService.get<number>('DB_PORT'),
				username: configService.get<string>('DB_USERNAME'),
				password: configService.get<string>('DB_PASSWORD'),
				database: configService.get<string>('DB_NAME'),
				entities: [Category],
				synchronize: true, // Para desenvolvimento; em produção, use migrations.
				// logging: true,
			});

			return dataSource.initialize();
		},
	},
];
