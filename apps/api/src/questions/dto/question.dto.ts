import { IsString, IsOptional, IsIn, IsInt, Min, MaxLength, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateQuestionDto {
  @IsString()
  @MaxLength(2000)
  content: string;

  @IsIn(['mc', 'essay'])
  questionType: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  correctAnswer?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  explanation?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  orderIndex?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  points?: number;
}

export class UpdateQuestionDto {
  @IsString()
  @MaxLength(2000)
  @IsOptional()
  content?: string;

  @IsIn(['mc', 'essay'])
  @IsOptional()
  questionType?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  correctAnswer?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  explanation?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  orderIndex?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  points?: number;
}

export class CreateOptionDto {
  @IsString()
  @MaxLength(500)
  content: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  orderIndex?: number;

  @IsOptional()
  isCorrect?: boolean;
}

export class UpdateOptionDto {
  @IsString()
  @MaxLength(500)
  @IsOptional()
  content?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  orderIndex?: number;

  @IsOptional()
  isCorrect?: boolean;
}