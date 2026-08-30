import { IsUUID } from 'class-validator';

export class AssignProcessDto {
  @IsUUID()
  studentId: string;

  @IsUUID()
  processId: string;
}
