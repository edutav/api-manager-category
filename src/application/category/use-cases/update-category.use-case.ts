import { Inject, Injectable } from '@nestjs/common';
import { ICategoryRepository } from '../../../domain/category/repositories/category.repository.interface';
import { UpdateCategoryDTO } from '../dto/update-category.dto';
import { CategoryDomainService } from '../../../domain/category/services/category.domain-service';

Injectable();
export class UpdateCategoryUseCase {
	constructor(
		@Inject('ICategoryRepository')
		private readonly categoryRepository: ICategoryRepository,
		private readonly categoryDomainService: CategoryDomainService,
	) {}

	async execute(id: number, updateData: UpdateCategoryDTO): Promise<void> {
		// Obter a categoria pelo ID
		const category = await this.categoryRepository.findById(id);
		if (!category) {
			throw new Error('Categoria não encontrada');
		}

		// Se estiver atualizando o nome, verificar unicidade entre categorias irmãs
		if (updateData.name && category.parent) {
			await this.categoryDomainService.checkUniqueCategoryName(category.parent, updateData.name);
		}

		// Atualizar os campos permitidos
		if (updateData.name !== undefined) {
			category.name = updateData.name;
		}
		if (updateData.isActive !== undefined) {
			category.isActive = updateData.isActive;
		}

		await this.categoryRepository.update(category);
	}
}
