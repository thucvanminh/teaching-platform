import { Body, Controller, Delete, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateLessonDto, UpdateLessonDto } from './dto/lesson.dto';
import { LessonsService } from './lessons.service';

@Controller('lessons')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LessonsController {
  constructor(private service: LessonsService) {}

  @Post('process/:processId')
  @Roles('teacher')
  create(@Param('processId') processId: string, @Body() dto: CreateLessonDto, @Req() req: any) {
    return this.service.create(processId, dto, req.user.userId);
  }

  @Put(':id')
  @Roles('teacher')
  update(@Param('id') id: string, @Body() dto: UpdateLessonDto, @Req() req: any) {
    return this.service.update(id, dto, req.user.userId);
  }

  @Delete(':id')
  @Roles('teacher')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.service.remove(id, req.user.userId);
  }
}
