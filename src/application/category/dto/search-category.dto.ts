import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class SearchCategoryDTO {
	@ApiProperty({
		description: 'Category ID',
		required: false,
	})
	@IsInt()
	id: number;

	@ApiProperty({
		description: 'Category name',
		required: false,
	})
	@IsOptional()
	@IsString()
	name?: string;

	@ApiProperty({
		description: 'Status of the category',
		required: false,
	})
	@IsOptional()
	@IsBoolean()
	isActive: boolean;
}
