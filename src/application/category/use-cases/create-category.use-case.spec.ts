import { CreateCategoryUseCase } from './create-category.use-case';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateCategoryDTO } from '../dto/create-category.dto';
import { ICategoryRepository } from '../../../domain/category/repositories/category.repository.interface';
import { CategoryDomainService } from '../../../domain/category/services/category.domain-service';
import { Category } from '../../../domain/category/entities/category.entity';

describe('CreateCategoryUseCase', () => {
	let useCase: CreateCategoryUseCase;
	let categoryRepository: ICategoryRepository;
	let categoryDomainService: CategoryDomainService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CreateCategoryUseCase,
				{
					provide: 'ICategoryRepository',
					useValue: {
						findById: jest.fn(),
						create: jest.fn(),
					},
				},
				{
					provide: CategoryDomainService,
					useValue: {
						checkCategoryDepth: jest.fn(),
						checkUniqueCategoryName: jest.fn(),
						checkMaxChildrenLimit: jest.fn(),
					},
				},
			],
		}).compile();

		useCase = module.get<CreateCategoryUseCase>(CreateCategoryUseCase);
		categoryRepository = module.get<ICategoryRepository>('ICategoryRepository');
		categoryDomainService = module.get<CategoryDomainService>(CategoryDomainService);
	});

	it('should create a new category without parent category', async () => {
		// Input data without a parent category
		const dto: CreateCategoryDTO = { name: 'New Category', isActive: true };

		// We call the `execute` method and check if it runs without error
		await expect(useCase.execute(dto)).resolves.not.toThrow();

		// We check if the `create` method was called to create the new category
		expect(categoryRepository.create).toHaveBeenCalled();
	});

	it('should create a new category with parent category and pass all domain validations', async () => {
		// Simulating an existing parent category
		const parentCategory = new Category();
		parentCategory.id = 1;
		parentCategory.name = 'Parent Category';

		jest.spyOn(categoryRepository, 'findById').mockResolvedValue(parentCategory);

		// Input data with a parent category
		const dto: CreateCategoryDTO = { name: 'Child Category', parentId: 1, isActive: true };

		// We call the `execute` method and check if it runs without error
		await expect(useCase.execute(dto)).resolves.not.toThrow();

		// We check if the validation methods of `CategoryDomainService` were called
		expect(categoryDomainService.checkCategoryDepth).toHaveBeenCalledWith(parentCategory);
		expect(categoryDomainService.checkUniqueCategoryName).toHaveBeenCalledWith(parentCategory, dto.name);
		expect(categoryDomainService.checkMaxChildrenLimit).toHaveBeenCalledWith(parentCategory.id);

		// We check if the `create` method was called to create the new category
		expect(categoryRepository.create).toHaveBeenCalled();
	});

	it('should throw an error if parent category is not found', async () => {
		// Simulating that the repository did not find the parent category
		jest.spyOn(categoryRepository, 'findById').mockResolvedValue(null); // Retorna null

		// Creating the DTO with a non-existent parentId
		const dto = { parentId: 123, name: 'New Category', isActive: true };

		// Expect the execution of the 'execute' method to throw an error
		await expect(useCase.execute(dto)).rejects.toThrow('Categoria pai não encontrada');
	});
});
