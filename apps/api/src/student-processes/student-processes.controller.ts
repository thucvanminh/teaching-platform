import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AssignProcessDto } from './dto/assign-process.dto';
import { StudentProcessesService } from './student-processes.service';

@Controller('student-processes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentProcessesController {
  constructor(private service: StudentProcessesService) {}

  @Get()
  findAll(@Req() req: any) {
    return this.service.findAllForUser(req.user.userId, req.user.role);
  }

  @Get('students')
  @Roles('teacher')
  getStudents() {
    return this.service.getStudents();
  }

  @Post()
  @Roles('teacher')
  assign(@Body() dto: AssignProcessDto, @Req() req: any) {
    return this.service.assign(dto, req.user.userId);
  }

  @Delete(':id')
  @Roles('teacher')
  unassign(@Param('id') id: string, @Req() req: any) {
    return this.service.unassign(id, req.user.userId);
  }
}
