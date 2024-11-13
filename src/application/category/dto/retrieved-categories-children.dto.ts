import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsObject, IsOptional, IsString } from 'class-validator';

export class RetrievedCategoriesChildrenDTO {
	@ApiProperty({
		required: false,
		type: [RetrievedCategoriesChildrenDTO],
	})
	@IsObject({ each: true })
	@Type(() => RetrievedCategoriesChildrenDTO)
	children: RetrievedCategoriesChildrenDTO[];

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
