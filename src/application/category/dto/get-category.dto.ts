import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class GetCategoryDTO {
	@ApiProperty({
		description: 'Include children',
		required: false,
		type: Boolean,
	})
	@IsOptional()
	@IsBoolean()
	@Transform(({ value }) => value === 'true' || value === true)
	includeChildren: boolean;
}
