import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateSubmissionDto, GradeSubmissionDto } from './dto/submission.dto';
import { SubmissionsService } from './submissions.service';

@Controller('submissions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubmissionsController {
  constructor(private service: SubmissionsService) {}

  @Post()
  @Roles('student')
  create(@Body() dto: CreateSubmissionDto, @Req() req: any) {
    return this.service.createSubmission(dto, req.user.userId);
  }

  @Post(':id/grade')
  @Roles('student')
  grade(@Param('id') id: string, @Body() dto: GradeSubmissionDto, @Req() req: any) {
    return this.service.gradeSubmission(id, dto, req.user.userId);
  }

  @Get(':id/review')
  review(@Param('id') id: string, @Req() req: any) {
    return this.service.getSubmissionReview(id, req.user.userId, req.user.role);
  }

  @Get('history/:lessonId')
  @Roles('student')
  history(@Param('lessonId') lessonId: string, @Req() req: any) {
    return this.service.getSubmissionHistory(lessonId, req.user.userId);
  }

  @Get('teacher/:lessonId')
  @Roles('teacher')
  teacherSubmissions(@Param('lessonId') lessonId: string, @Req() req: any) {
    return this.service.getSubmissionsForTeacher(lessonId, req.user.userId);
  }
}