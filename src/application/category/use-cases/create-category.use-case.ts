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

	async execute(dto: CreateCategoryDTO): Promise<void> {
		const { name, parentId, isActive } = dto;

		// Verificar se a categoria pai existe e obter seus detalhes
		const parentCategory = parentId ? await this.categoryRepository.findById(parentId) : null;

		// Se a categoria pai não for encontrada, lançar um erro
		if (parentId && !parentCategory) {
			throw new Error('Categoria pai não encontrada');
		}

		// 1. Verificar profundidade da hierarquia, somente se houver parentCategory
		if (parentCategory) {
			await this.categoryDomainService.checkCategoryDepth(parentCategory);

			// 2. Garantir unicidade de nome entre categorias irmãs
			await this.categoryDomainService.checkUniqueCategoryName(parentCategory, name);

			// 3. Limitar número de categorias filhas com base no ID do parent
			await this.categoryDomainService.checkMaxChildrenLimit(parentCategory.id);
		}

		// Criar a nova categoria
		const newCategory = new Category();
		newCategory.name = name;
		newCategory.isActive = isActive ?? true;
		newCategory.parent = parentCategory;

		// Salvar a nova categoria no repositório
		await this.categoryRepository.create(newCategory);
	}
}
