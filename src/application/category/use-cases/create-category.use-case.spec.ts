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
						create: jest.fn(), // Mock do método create
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
		// Dados de entrada sem uma categoria pai
		const dto: CreateCategoryDTO = { name: 'New Category', isActive: true };

		// Chamamos o método `execute` e verificamos se ele roda sem erro
		await expect(useCase.execute(dto)).resolves.not.toThrow();

		// Verificamos se o método `create` foi chamado para criar a nova categoria
		expect(categoryRepository.create).toHaveBeenCalled();
	});

	it('should create a new category with parent category and pass all domain validations', async () => {
		// Mock para categoria pai existente
		const parentCategory = new Category();
		parentCategory.id = 1;
		parentCategory.name = 'Parent Category';

		jest.spyOn(categoryRepository, 'findById').mockResolvedValue(parentCategory);

		// Dados de entrada com uma categoria pai
		const dto: CreateCategoryDTO = { name: 'Child Category', parentId: 1, isActive: true };

		// Chamamos o método `execute` e verificamos se ele roda sem erro
		await expect(useCase.execute(dto)).resolves.not.toThrow();

		// Verificamos se os métodos de validação do `CategoryDomainService` foram chamados
		expect(categoryDomainService.checkCategoryDepth).toHaveBeenCalledWith(parentCategory);
		expect(categoryDomainService.checkUniqueCategoryName).toHaveBeenCalledWith(parentCategory, dto.name);
		expect(categoryDomainService.checkMaxChildrenLimit).toHaveBeenCalledWith(parentCategory.id);

		// Verificamos se o método `create` foi chamado para criar a nova categoria
		expect(categoryRepository.create).toHaveBeenCalled();
	});

	it('should throw an error if parent category is not found', async () => {
		// Simulando que o repositório não encontrou a categoria pai
		jest.spyOn(categoryRepository, 'findById').mockResolvedValue(null); // Retorna null

		// Criando o DTO com um parentId inexistente
		const dto = { parentId: 123, name: 'New Category', isActive: true };

		// Espera que a execução do método 'execute' lance um erro
		await expect(useCase.execute(dto)).rejects.toThrow('Categoria pai não encontrada');
	});
});
