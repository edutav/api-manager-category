import { Inject, Injectable } from '@nestjs/common';
import { Category } from '../../../domain/category/entities/category.entity';
import { ICategoryRepository } from '../../../domain/category/repositories/category.repository.interface';
import { FindCategoryDTO } from '../dto/find-category.dto';
import { SearchCategoryDTO } from '../dto/search-category.dto';

@Injectable()
export class SearchCategoryUseCase {
	constructor(
		@Inject('ICategoryRepository')
		private readonly categoryRepository: ICategoryRepository,
	) {}

	async execute(searchCriteria: FindCategoryDTO): Promise<SearchCategoryDTO[]> {
		const category = new Category();

		category.name = searchCriteria.name;
		category.isActive = searchCriteria.isActive;

		const categories = await this.categoryRepository.findAll(category);

		const categoryDTOs = new Array<SearchCategoryDTO>();

		for (const category of categories) {
			const categoryDTO = new SearchCategoryDTO();
			categoryDTO.id = category.id;
			categoryDTO.name = category.name;
			categoryDTO.isActive = category.isActive;

			categoryDTOs.push(categoryDTO);
		}

		return categoryDTOs;
	}
}
