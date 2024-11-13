import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class FindCategoryDTO {
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
