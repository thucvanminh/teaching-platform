import { IsString, IsOptional, IsIn, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLessonDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsIn(['website', 'pdf', 'video', 'document'])
  lessonType: string;

  @IsString()
  contentUrl: string;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  orderIndex: number;
}

export class UpdateLessonDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsIn(['website', 'pdf', 'video', 'document'])
  @IsOptional()
  lessonType?: string;

  @IsString()
  @IsOptional()
  contentUrl?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  orderIndex?: number;
}
