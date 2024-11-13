import { Injectable } from '@nestjs/common';
import { Category } from '../../domain/category/entities/category.entity';
import { ICategoryRepository } from '../../domain/category/repositories/category.repository.interface';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class CategoryRepository implements ICategoryRepository {
	private readonly repository: Repository<Category>;

	constructor(dataSource: DataSource) {
		this.repository = dataSource.getRepository(Category);
	}

	async create(category: Category): Promise<Category> {
		const newCategory = await this.repository.create(category);
		return await this.repository.save(newCategory);
	}

	async findAll(filters: Category): Promise<Category[]> {
		const query = this.repository.createQueryBuilder('category');

		if (filters.name) {
			query.andWhere('category.name LIKE :name', { name: `%${filters.name}%` });
		}

		if (filters.isActive !== undefined) {
			query.andWhere('category.isActive = :isActive', { isActive: filters.isActive });
		}

		return await query.getMany();
	}

	async findById(id: number): Promise<Category | null> {
		return await this.repository.findOne({ where: { id }, relations: ['parent', 'children'] });
	}

	async findChildren(parentId: number): Promise<Category[]> {
		return await this.repository.find({ where: { parent: { id: parentId } } });
	}

	async update(category: Category): Promise<Category> {
		return await this.repository.save(category);
	}

	async deleteWithChildren(category: Category): Promise<void> {
		await this.repository.remove(category);
	}

	async findByIDChildren(id: number): Promise<Category | null> {
		const category = await this.repository.findOne({
			where: { id },
			relations: ['children'], // Inclua a relação children
		});
		return category;
	}

	async findParent(parentId: number): Promise<Category | null> {
		return this.repository.findOne({ where: { id: parentId } });
	}

	async countChildren(parentId: number): Promise<number> {
		return this.repository.count({ where: { parent: { id: parentId } } });
	}
}
