import { Inject, Injectable } from '@nestjs/common';
import { ICategoryRepository } from '../../../domain/category/repositories/category.repository.interface';

Injectable();
export class DeleteCategoryUseCase {
	constructor(
		@Inject('ICategoryRepository')
		private readonly categoryRepository: ICategoryRepository,
	) {}

	async execute(id: number): Promise<void> {
		const category = await this.categoryRepository.findByIDChildren(id);
		if (!category) {
			throw new Error('Category not found');
		}

		await this.categoryRepository.deleteWithChildren(category);
	}
}
