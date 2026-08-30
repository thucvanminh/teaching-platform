import { Module } from '@nestjs/common';
import { StudentProcessesController } from './student-processes.controller';
import { StudentProcessesService } from './student-processes.service';

@Module({
  imports: [],
  controllers: [StudentProcessesController],
  providers: [StudentProcessesService],
})
export class StudentProcessesModule {}
