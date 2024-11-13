import { Inject, Injectable } from '@nestjs/common';
import { ICategoryRepository } from '../../../domain/category/repositories/category.repository.interface';
import { RetrievedCategoriesChildrenDTO } from '../dto/retrieved-categories-children.dto';

@Injectable()
export class GetCategoryUseCase {
	constructor(
		@Inject('ICategoryRepository')
		private readonly categoryRepository: ICategoryRepository,
	) {}

	async execute(id: number, includeChildren: boolean): Promise<RetrievedCategoriesChildrenDTO> {
		const category = await this.categoryRepository.findById(id);
		if (includeChildren) {
			category.children = await this.categoryRepository.findChildren(id);
		}

		const dto = new RetrievedCategoriesChildrenDTO();
		dto.id = category.id;
		dto.name = category.name;
		dto.isActive = category.isActive;
		dto.children = [];

		if (category.children.length > 0) {
			for (const child of category.children) {
				const childDto = new RetrievedCategoriesChildrenDTO();
				childDto.id = child.id;
				childDto.name = child.name;
				childDto.isActive = child.isActive;
				dto.children.push(childDto);
			}
		}

		return dto;
	}
}
