import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CreateCategoryUseCase } from '../../application/category/use-cases/create-category.use-case';
import { SearchCategoryUseCase } from '../../application/category/use-cases/search-category.use-case';
import { GetCategoryUseCase } from '../../application/category/use-cases/get-category.use-case';
import { UpdateCategoryUseCase } from '../../application/category/use-cases/update-category.use-case';
import { DeleteCategoryUseCase } from '../../application/category/use-cases/delete-category.use-case';
import { CreateCategoryDTO } from '../../application/category/dto/create-category.dto';
import { SearchCategoryDTO } from '../../application/category/dto/search-category.dto';
import { RetrievedCategoriesChildrenDTO } from '../../application/category/dto/retrieved-categories-children.dto';
import { UpdateCategoryDTO } from '../../application/category/dto/update-category.dto';

// Mocking the use cases
const mockCreateCategoryUseCase = {
	execute: jest.fn(),
};

const mockSearchCategoryUseCase = {
	execute: jest.fn(),
};

const mockGetCategoryUseCase = {
	execute: jest.fn(),
};

const mockUpdateCategoryUseCase = {
	execute: jest.fn(),
};

const mockDeleteCategoryUseCase = {
	execute: jest.fn(),
};

describe('CategoryController', () => {
	let categoryController: CategoryController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [CategoryController],
			providers: [
				{
					provide: CreateCategoryUseCase,
					useValue: mockCreateCategoryUseCase,
				},
				{
					provide: SearchCategoryUseCase,
					useValue: mockSearchCategoryUseCase,
				},
				{
					provide: GetCategoryUseCase,
					useValue: mockGetCategoryUseCase,
				},
				{
					provide: UpdateCategoryUseCase,
					useValue: mockUpdateCategoryUseCase,
				},
				{
					provide: DeleteCategoryUseCase,
					useValue: mockDeleteCategoryUseCase,
				},
			],
		}).compile();

		categoryController = module.get<CategoryController>(CategoryController);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('createCategory', () => {
		it('should create a category successfully', async () => {
			const createCategoryDTO: CreateCategoryDTO = {
				name: 'New Category',
				isActive: true,
			};
			mockCreateCategoryUseCase.execute.mockResolvedValue(undefined); // Simulating successful execution

			await expect(categoryController.createCategory(createCategoryDTO)).resolves.not.toThrow();
			expect(mockCreateCategoryUseCase.execute).toHaveBeenCalledWith(createCategoryDTO);
		});

		it('should throw an error if create category fails', async () => {
			const createCategoryDTO: CreateCategoryDTO = {
				name: 'New Category',
				isActive: true,
			};
			mockCreateCategoryUseCase.execute.mockRejectedValue(new Error('Failed to create category'));

			await expect(categoryController.createCategory(createCategoryDTO)).rejects.toThrowError(
				'Failed to create category',
			);
			expect(mockCreateCategoryUseCase.execute).toHaveBeenCalledWith(createCategoryDTO);
		});
	});

	describe('searchCategories', () => {
		it('should return categories successfully', async () => {
			const searchCriteria = { name: 'Category', isActive: true }; // Example search criteria
			const categories: SearchCategoryDTO[] = [{ id: 1, name: 'Category One', isActive: true }];
			mockSearchCategoryUseCase.execute.mockResolvedValue(categories);

			const result = await categoryController.searchCategories(searchCriteria);
			expect(result).toEqual(categories);
			expect(mockSearchCategoryUseCase.execute).toHaveBeenCalledWith(searchCriteria);
		});

		it('should return an empty array if no categories found', async () => {
			const searchCriteria = { name: 'Non Existent Category', isActive: true };
			mockSearchCategoryUseCase.execute.mockResolvedValue([]);

			const result = await categoryController.searchCategories(searchCriteria);
			expect(result).toEqual([]);
			expect(mockSearchCategoryUseCase.execute).toHaveBeenCalledWith(searchCriteria);
		});
	});

	describe('getCategoryById', () => {
		it('should return a category by ID successfully', async () => {
			const categoryId = 1;
			const categoryDTO: RetrievedCategoriesChildrenDTO = { id: 1, name: 'Category One', isActive: true, children: [] };
			mockGetCategoryUseCase.execute.mockResolvedValue(categoryDTO);

			const result = await categoryController.getCategoryById(categoryId, { includeChildren: true });
			expect(result).toEqual(categoryDTO);
			expect(mockGetCategoryUseCase.execute).toHaveBeenCalledWith(categoryId, true);
		});

		it('should throw an error if category not found', async () => {
			const categoryId = 999;
			mockGetCategoryUseCase.execute.mockResolvedValue(null);

			await expect(categoryController.getCategoryById(categoryId, { includeChildren: true })).rejects.toThrowError(
				'Category not found',
			);
		});
	});

	describe('updateCategory', () => {
		it('should update a category successfully', async () => {
			const categoryId = 1;
			const updateCategoryDTO: UpdateCategoryDTO = { name: 'Updated Category', isActive: false };
			mockUpdateCategoryUseCase.execute.mockResolvedValue(undefined);

			await expect(categoryController.updateCategory(categoryId, updateCategoryDTO)).resolves.not.toThrow();
			expect(mockUpdateCategoryUseCase.execute).toHaveBeenCalledWith(categoryId, updateCategoryDTO);
		});

		it('should throw an error if update category fails', async () => {
			const categoryId = 1;
			const updateCategoryDTO: UpdateCategoryDTO = { name: 'Updated Category', isActive: false };
			mockUpdateCategoryUseCase.execute.mockRejectedValue(new Error('Failed to update category'));

			await expect(categoryController.updateCategory(categoryId, updateCategoryDTO)).rejects.toThrowError(
				'Failed to update category',
			);
		});
	});

	describe('deleteCategory', () => {
		it('should delete a category successfully', async () => {
			const categoryId = 1;
			mockDeleteCategoryUseCase.execute.mockResolvedValue(undefined);

			await expect(categoryController.deleteCategory(categoryId)).resolves.not.toThrow();
			expect(mockDeleteCategoryUseCase.execute).toHaveBeenCalledWith(categoryId);
		});

		it('should throw an error if delete category fails', async () => {
			const categoryId = 999;
			mockDeleteCategoryUseCase.execute.mockRejectedValue(new Error('Failed to delete category'));

			await expect(categoryController.deleteCategory(categoryId)).rejects.toThrow('Failed to delete category');
		});
	});
});
