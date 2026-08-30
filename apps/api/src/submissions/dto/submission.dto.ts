import { IsUUID, IsString, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSubmissionDto {
  @IsUUID()
  lessonId: string;
}

export class AnswerDto {
  @IsUUID()
  questionId: string;

  @IsUUID()
  @IsOptional()
  selectedOptionId?: string;

  @IsString()
  @IsOptional()
  essayAnswer?: string;
}

export class GradeSubmissionDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: AnswerDto[];
}