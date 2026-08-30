import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateThemeDto, UpdateThemeDto } from './dto/theme.dto';
import { CreateLessonDto, UpdateLessonDto } from '../lessons/dto/lesson.dto';
import { ThemesService } from './themes.service';
import { LessonsService } from '../lessons/lessons.service';

@Controller('processes/:processId/themes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ThemesController {
  constructor(
    private themesService: ThemesService,
    private lessonsService: LessonsService,
  ) {}

  @Get()
  findAllThemes(@Param('processId') processId: string, @Req() req: any) {
    return this.themesService.findAllForProcess(processId, req.user.userId, req.user.role);
  }

  @Get(':id')
  findOneTheme(@Param('id') id: string, @Req() req: any) {
    return this.themesService.findOne(id, req.user.userId, req.user.role);
  }

  @Post()
  @Roles('teacher')
  createTheme(@Param('processId') processId: string, @Body() dto: CreateThemeDto, @Req() req: any) {
    return this.themesService.create(processId, dto, req.user.userId);
  }

  @Put(':id')
  @Roles('teacher')
  updateTheme(@Param('id') id: string, @Body() dto: UpdateThemeDto, @Req() req: any) {
    return this.themesService.update(id, dto, req.user.userId);
  }

  @Delete(':id')
  @Roles('teacher')
  removeTheme(@Param('id') id: string, @Req() req: any) {
    return this.themesService.remove(id, req.user.userId);
  }

  @Put('reorder')
  @Roles('teacher')
  reorderThemes(@Param('processId') processId: string, @Body() themeIds: string[], @Req() req: any) {
    return this.themesService.reorder(processId, themeIds, req.user.userId);
  }

  // Lessons under a theme
  @Get(':themeId/lessons')
  findAllLessons(@Param('themeId') themeId: string, @Req() req: any) {
    return this.lessonsService.findAllForTheme(themeId, req.user.userId, req.user.role);
  }

  @Get(':themeId/lessons/:lessonId')
  findOneLesson(@Param('lessonId') lessonId: string, @Req() req: any) {
    return this.lessonsService.findOne(lessonId, req.user.userId, req.user.role);
  }

  @Post(':themeId/lessons')
  @Roles('teacher')
  createLesson(
    @Param('processId') processId: string,
    @Param('themeId') themeId: string,
    @Body() dto: CreateLessonDto,
    @Req() req: any,
  ) {
    return this.lessonsService.createForTheme(themeId, dto, req.user.userId);
  }

  @Put(':themeId/lessons/:lessonId')
  @Roles('teacher')
  updateLesson(
    @Param('lessonId') lessonId: string,
    @Body() dto: UpdateLessonDto,
    @Req() req: any,
  ) {
    return this.lessonsService.update(lessonId, dto, req.user.userId);
  }

  @Delete(':themeId/lessons/:lessonId')
  @Roles('teacher')
  removeLesson(@Param('lessonId') lessonId: string, @Req() req: any) {
    return this.lessonsService.remove(lessonId, req.user.userId);
  }
}