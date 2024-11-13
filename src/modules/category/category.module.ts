import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateCategoryUseCase } from '../../application/category/use-cases/create-category.use-case';
import { DeleteCategoryUseCase } from '../../application/category/use-cases/delete-category.use-case';
import { GetCategoryUseCase } from '../../application/category/use-cases/get-category.use-case';
import { SearchCategoryUseCase } from '../../application/category/use-cases/search-category.use-case';
import { UpdateCategoryUseCase } from '../../application/category/use-cases/update-category.use-case';
// import { Category } from 'src/domain/category/entities/category.entity';
import { CategoryDomainService } from '../../domain/category/services/category.domain-service';
import { CategoryRepository } from '../../infrastructure/repositories/category.repository';
import { CategoryController } from '../../presentation/category/category.controller';

@Module({
	// imports: [TypeOrmModule.forFeature([Category])],
	controllers: [CategoryController],
	providers: [
		// CategoryService,
		CategoryDomainService,
		CreateCategoryUseCase,
		SearchCategoryUseCase,
		GetCategoryUseCase,
		UpdateCategoryUseCase,
		DeleteCategoryUseCase,
		{
			provide: 'ICategoryRepository',
			useClass: CategoryRepository,
		},
	],
	exports: [
		// CategoryService,
		CategoryDomainService,
		CreateCategoryUseCase,
		SearchCategoryUseCase,
		GetCategoryUseCase,
		UpdateCategoryUseCase,
		DeleteCategoryUseCase,
	],
})
export class CategoryModule {}
