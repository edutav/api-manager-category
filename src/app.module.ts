import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './domain/category/entities/category.entity';
import { CategoryModule } from './modules/category/category.module';

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: 'localhost',
			port: 5432,
			username: 'postgres',
			password: 'postgres',
			database: 'api_dev',
			entities: [Category],
			synchronize: true,
			// logging: true,
		}),
		CategoryModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
