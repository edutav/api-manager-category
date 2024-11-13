import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpException,
	HttpStatus,
	Param,
	Post,
	Put,
	Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCategoryDTO } from '../../application/category/dto/create-category.dto';
import { FindCategoryDTO } from '../../application/category/dto/find-category.dto';
import { GetCategoryDTO } from '../../application/category/dto/get-category.dto';
import { RetrievedCategoriesChildrenDTO } from '../../application/category/dto/retrieved-categories-children.dto';
import { SearchCategoryDTO } from '../../application/category/dto/search-category.dto';
import { UpdateCategoryDTO } from '../../application/category/dto/update-category.dto';
import { CreateCategoryUseCase } from '../../application/category/use-cases/create-category.use-case';
import { DeleteCategoryUseCase } from '../../application/category/use-cases/delete-category.use-case';
import { GetCategoryUseCase } from '../../application/category/use-cases/get-category.use-case';
import { SearchCategoryUseCase } from '../../application/category/use-cases/search-category.use-case';
import { UpdateCategoryUseCase } from '../../application/category/use-cases/update-category.use-case';

@ApiTags('Category')
@Controller('categories')
export class CategoryController {
	constructor(
		private readonly createCategoryUseCase: CreateCategoryUseCase,
		private readonly searchCategoryUseCase: SearchCategoryUseCase,
		private readonly getCategoryUseCase: GetCategoryUseCase,
		private readonly updateCategoryUseCase: UpdateCategoryUseCase,
		private readonly deleteCategoryUseCase: DeleteCategoryUseCase,
	) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({ summary: 'Create a new category' })
	@ApiResponse({
		status: HttpStatus.CREATED,
		description: 'Category created successfully',
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: 'Error creating category',
	})
	@ApiResponse({
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		description: 'Internal server error',
	})
	async createCategory(@Body() createCategoryDTO: CreateCategoryDTO): Promise<void> {
		try {
			await this.createCategoryUseCase.execute(createCategoryDTO);
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
		}
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Search categories' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Categories found',
		schema: { example: [{ id: 1, name: 'Category One', isActive: true }] },
		type: SearchCategoryDTO,
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Categories not found',
	})
	@ApiResponse({
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		description: 'Internal server error',
	})
	async searchCategories(@Query() searchCriteria: FindCategoryDTO): Promise<SearchCategoryDTO[]> {
		return await this.searchCategoryUseCase.execute(searchCriteria);
	}

	@Get(':id')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Get category by ID' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Category found',
		type: RetrievedCategoriesChildrenDTO,
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Category not found',
	})
	@ApiResponse({
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		description: 'Internal server error',
	})
	async getCategoryById(
		@Param('id') id: number,
		@Query() getCategoryDTO: GetCategoryDTO,
	): Promise<RetrievedCategoriesChildrenDTO> {
		const category = await this.getCategoryUseCase.execute(id, getCategoryDTO.includeChildren);
		if (!category) {
			throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
		}
		return category;
	}

	@Put(':id')
	@ApiOperation({ summary: 'Update category' })
	@ApiResponse({
		status: HttpStatus.NO_CONTENT,
		description: 'Category updated successfully',
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: 'Error updating category',
	})
	@ApiResponse({
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		description: 'Internal server error',
	})
	async updateCategory(@Param('id') id: number, @Body() updateCategoryDTO: UpdateCategoryDTO): Promise<void> {
		try {
			return await this.updateCategoryUseCase.execute(id, updateCategoryDTO);
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
		}
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({ summary: 'Delete category by ID' })
	@ApiResponse({
		status: HttpStatus.NO_CONTENT,
		description: 'Category deleted successfully',
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Category not found',
	})
	@ApiResponse({
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		description: 'Internal server error',
	})
	async deleteCategory(@Param('id') id: number): Promise<void> {
		try {
			return await this.deleteCategoryUseCase.execute(id);
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
		}
	}
}
