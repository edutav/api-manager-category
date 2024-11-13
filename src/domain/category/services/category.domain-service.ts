import { Inject, Injectable } from '@nestjs/common';
import { Category } from '../entities/category.entity';
import { ICategoryRepository } from '../repositories/category.repository.interface';

@Injectable()
export class CategoryDomainService {
	public readonly MAX_DEPTH = 5;
	public readonly MAX_CHILDREN = 20;

	constructor(
		@Inject('ICategoryRepository')
		private readonly categoryRepository: ICategoryRepository,
	) {}

	// Método que verifica se a profundidade de uma categoria é válida
	async checkCategoryDepth(category: Category): Promise<void> {
		const depth = await this.calculateDepth(category);
		if (depth > this.MAX_DEPTH) {
			throw new Error(`A profundidade da categoria não pode ultrapassar ${this.MAX_DEPTH} níveis.`);
		}
	}

	// Método que verifica se o nome da categoria é único para o pai
	async checkUniqueCategoryName(parentCategory: Category, name: string): Promise<void> {
		const siblingCategories = await this.categoryRepository.findChildren(parentCategory.id);
		const isDuplicate = siblingCategories.some((category) => category.name === name);

		if (isDuplicate) {
			throw new Error('O nome da categoria já existe entre as categorias irmãs.');
		}
	}

	// Método que verifica se o pai tem mais de 20 filhas
	async checkMaxChildrenLimit(parentId: number): Promise<void> {
		const childCount = await this.categoryRepository.countChildren(parentId);
		if (childCount >= this.MAX_CHILDREN) {
			throw new Error(`A categoria pai já atingiu o limite de ${this.MAX_CHILDREN} filhas.`);
		}
	}

	async calculateDepth(category: Category): Promise<number> {
		let depth = 1;
		let currentCategory = category;

		while (currentCategory.parent) {
			depth++;
			if (depth > this.MAX_DEPTH) break; // Early exit se já estiver além do limite
			currentCategory = await this.categoryRepository.findParent(currentCategory.parent.id);
		}

		return depth;
	}

	checkActiveStatus(category: Category): void {
		if (!category.isActive) {
			throw new Error('A categoria está inativa.');
		}
	}

	validateCreateCategory(data: any): void {
		if (!data.name) {
			throw new Error('Name is required');
		}
	}

	validateSearchCategory(criteria: any): void {
		if (criteria.name && typeof criteria.name !== 'string') {
			throw new Error('Name must be a string');
		}

		if (criteria.isActive !== undefined && typeof criteria.isActive !== 'boolean') {
			throw new Error('isActive must be a boolean');
		}
	}

	filterCategoriesAux(categories: Category[], criteria: any): Category[] {
		return categories.filter((category) => {
			let isValid = true;
			if (criteria.name) isValid = isValid && category.name.includes(criteria.name);
			if (criteria.isActive !== undefined) isValid = isValid && category.isActive === criteria.isActive;
			return isValid;
		});
	}

	filterCategories(categories: Category[], criteria: any): Category[] {
		return categories.filter((category) => {
			let isValid = true;
			if (criteria.name) isValid = isValid && category.name.includes(criteria.name); // Usando includes
			if (criteria.isActive !== undefined) isValid = isValid && category.isActive === criteria.isActive;
			return isValid;
		});
	}

	validateCategoryStatusUpdate(category: Category): void {
		// Exemplo de validação de negócio específica para ativação/desativação
		if (category.isActive === false && category.children?.some((child) => child.isActive)) {
			throw new Error('Não é possível desativar uma categoria com subcategorias ativas');
		}
	}
}
