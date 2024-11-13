import { Test, TestingModule } from '@nestjs/testing';
import { CategoryDomainService } from './category.domain-service';
import { ICategoryRepository } from '../repositories/category.repository.interface';
import { Category } from '../entities/category.entity';

describe('CategoryDomainService', () => {
	let categoryDomainService: CategoryDomainService;
	let categoryRepository: jest.Mocked<ICategoryRepository>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CategoryDomainService,
				{
					provide: 'ICategoryRepository',
					useValue: {
						findChildren: jest.fn(),
						countChildren: jest.fn(),
						findParent: jest.fn(),
					},
				},
			],
		}).compile();

		categoryDomainService = module.get<CategoryDomainService>(CategoryDomainService);
		categoryRepository = module.get('ICategoryRepository');
	});

	describe('checkCategoryDepth', () => {
		it('should throw an error if the category depth exceeds the limit', async () => {
			const category = { parent: { id: 1 } } as Category;

			jest.spyOn(categoryDomainService, 'calculateDepth').mockResolvedValue(6);

			await expect(categoryDomainService.checkCategoryDepth(category)).rejects.toThrow(
				`A profundidade da categoria não pode ultrapassar ${categoryDomainService.MAX_DEPTH} níveis.`,
			);
		});

		it('should not throw an error if the category depth is within the limit', async () => {
			const category = { parent: { id: 1 } } as Category;

			jest.spyOn(categoryDomainService, 'calculateDepth').mockResolvedValue(3);

			await expect(categoryDomainService.checkCategoryDepth(category)).resolves.not.toThrow();
		});
	});

	describe('checkUniqueCategoryName', () => {
		it('should throw an error if a sibling category has the same name', async () => {
			const parentCategory = { id: 1 } as Category;
			const siblingCategories = [{ name: 'Duplicated Name' }] as Category[];
			categoryRepository.findChildren.mockResolvedValue(siblingCategories);

			await expect(categoryDomainService.checkUniqueCategoryName(parentCategory, 'Duplicated Name')).rejects.toThrow(
				'O nome da categoria já existe entre as categorias irmãs.',
			);
		});

		it('should not throw an error if no sibling category has the same name', async () => {
			const parentCategory = { id: 1 } as Category;
			const siblingCategories = [{ name: 'Other Name' }] as Category[];
			categoryRepository.findChildren.mockResolvedValue(siblingCategories);

			await expect(categoryDomainService.checkUniqueCategoryName(parentCategory, 'Unique Name')).resolves.not.toThrow();
		});
	});

	describe('checkMaxChildrenLimit', () => {
		it('should throw an error if the parent category has reached the max children limit', async () => {
			categoryRepository.countChildren.mockResolvedValue(20);

			await expect(categoryDomainService.checkMaxChildrenLimit(1)).rejects.toThrow(
				`A categoria pai já atingiu o limite de ${categoryDomainService.MAX_CHILDREN} filhas.`,
			);
		});

		it('should not throw an error if the parent category has not reached the max children limit', async () => {
			categoryRepository.countChildren.mockResolvedValue(10);

			await expect(categoryDomainService.checkMaxChildrenLimit(1)).resolves.not.toThrow();
		});
	});

	describe('validateCreateCategory', () => {
		it('should throw an error if name is not provided', () => {
			expect(() => categoryDomainService.validateCreateCategory({})).toThrow('Name is required');
		});

		it('should not throw an error if name is provided', () => {
			expect(() => categoryDomainService.validateCreateCategory({ name: 'New Category' })).not.toThrow();
		});
	});

	describe('validateSearchCategory', () => {
		it('should throw an error if name is not a string', () => {
			expect(() => categoryDomainService.validateSearchCategory({ name: 123 })).toThrow('Name must be a string');
		});

		it('should throw an error if isActive is not a boolean', () => {
			expect(() => categoryDomainService.validateSearchCategory({ isActive: 'yes' })).toThrow(
				'isActive must be a boolean',
			);
		});

		it('should not throw an error for valid criteria', () => {
			expect(() => categoryDomainService.validateSearchCategory({ name: 'Category', isActive: true })).not.toThrow();
		});
	});

	describe('filterCategories', () => {
		it('should filter categories based on name and isActive criteria', () => {
			const categories = [
				{ name: 'Category1', isActive: true },
				{ name: 'Category2', isActive: false },
				{ name: 'Another Category', isActive: true },
				{ name: 'Different Category', isActive: true },
			] as Category[];

			const result = categoryDomainService.filterCategories(categories, { name: 'Category', isActive: true });

			expect(result).toEqual([
				{ name: 'Category1', isActive: true },
				{ name: 'Another Category', isActive: true },
				{ name: 'Different Category', isActive: true },
			]);
		});
	});

	describe('validateCategoryStatusUpdate', () => {
		it('should throw an error if trying to deactivate a category with active subcategories', () => {
			const category = {
				isActive: false,
				children: [{ isActive: true }] as Category[],
			} as Category;

			expect(() => categoryDomainService.validateCategoryStatusUpdate(category)).toThrow(
				'Não é possível desativar uma categoria com subcategorias ativas',
			);
		});

		it('should not throw an error if deactivating a category with all inactive subcategories', () => {
			const category = {
				isActive: false,
				children: [{ isActive: false }] as Category[],
			} as Category;

			expect(() => categoryDomainService.validateCategoryStatusUpdate(category)).not.toThrow();
		});
	});
});
