import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDTO {
	@ApiPropertyOptional({
		description: 'Nome da categoria',
		example: 'Eletrônicos',
	})
	@IsOptional()
	@IsString()
	name?: string;

	@ApiPropertyOptional({ description: 'Status da categoria (ativa ou inativa)' })
	@IsOptional()
	@IsBoolean()
	isActive?: boolean;
}
