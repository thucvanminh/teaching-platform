import { IsOptional, IsString, IsIn } from 'class-validator';

export class CreateProcessDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateProcessDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsIn(['active', 'draft', 'archived'])
  @IsOptional()
  status?: string;
}
