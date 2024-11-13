import { Category } from '../entities/category.entity';

export interface ICategoryRepository {
	create(category: Category): Promise<Category>;
	findAll(filters: Category): Promise<Category[]>;
	findById(id: number): Promise<Category | null>;
	findChildren(parentId: number): Promise<Category[]>;
	update(category: Category): Promise<Category>;
	deleteWithChildren(category: Category): Promise<void>;
	findByIDChildren(id: number): Promise<Category | null>;

	findParent(parentId: number): Promise<Category | null>;
	countChildren(parentId: number): Promise<number>;
}
