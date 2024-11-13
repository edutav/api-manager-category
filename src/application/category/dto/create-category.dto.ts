import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDTO {
	@ApiProperty({
		description: 'Category name',
		example: 'Category 1',
		required: true,
	})
	@IsString()
	@MaxLength(100, { message: 'The name cannot be longer than 100 characters' })
	name: string;

	@IsNotEmpty({ message: 'Parent ID is required' })
	@ApiProperty({
		description: 'Parent category ID (Optional)',
		example: 1,
		required: false,
	})
	@IsInt()
	@IsOptional()
	parentId?: number;

	@ApiProperty({
		description: 'Active status',
		example: true,
		required: false,
	})
	@IsOptional()
	@IsBoolean()
	isActive?: boolean;
}
