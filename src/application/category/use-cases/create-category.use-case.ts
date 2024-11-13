import { Inject, Injectable } from '@nestjs/common';
import { CreateCategoryDTO } from '../dto/create-category.dto';
import { ICategoryRepository } from '../../../domain/category/repositories/category.repository.interface';
import { CategoryDomainService } from '../../../domain/category/services/category.domain-service';
import { Category } from '../../../domain/category/entities/category.entity';

@Injectable()
export class CreateCategoryUseCase {
	constructor(
		@Inject('ICategoryRepository')
		private readonly categoryRepository: ICategoryRepository,
		private readonly categoryDomainService: CategoryDomainService,
	) {}

	/**
	 * Executes the use case to create a new category.
	 *
	 * @param dto - Data transfer object containing the details for the new category.
	 * @throws {Error} If the parent category is not found.
	 * @throws {Error} If the category depth exceeds the allowed limit.
	 * @throws {Error} If the category name is not unique among sibling categories.
	 * @throws {Error} If the number of child categories exceeds the allowed limit.
	 * @returns {Promise<void>} A promise that resolves when the category is successfully created.
	 */
	async execute(dto: CreateCategoryDTO): Promise<void> {
		const { name, parentId, isActive } = dto;

		// Check if the parent category exists and get its details
		const parentCategory = parentId ? await this.categoryRepository.findById(parentId) : null;

		// If the parent category is not found, throw an error
		if (parentId && !parentCategory) {
			throw new Error('Categoria pai não encontrada');
		}

		// 1. Check hierarchy depth, only if there is a parentCategory
		if (parentCategory) {
			await this.categoryDomainService.checkCategoryDepth(parentCategory);

			// 2. Ensure unique name among sibling categories
			await this.categoryDomainService.checkUniqueCategoryName(parentCategory, name);

			// 3. Limit the number of child categories based on the parent ID
			await this.categoryDomainService.checkMaxChildrenLimit(parentCategory.id);
		}

		// Create new category
		const newCategory = new Category();
		newCategory.name = name;
		newCategory.isActive = isActive ?? true;
		newCategory.parent = parentCategory;

		// Save the new category in the repository
		await this.categoryRepository.create(newCategory);
	}
}
