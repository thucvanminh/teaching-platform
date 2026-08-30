import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateQuestionDto, UpdateQuestionDto, CreateOptionDto, UpdateOptionDto } from './dto/question.dto';
import { QuestionsService } from './questions.service';

@Controller('lessons/:lessonId/questions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class QuestionsController {
  constructor(private service: QuestionsService) {}

  @Get()
  findAll(@Param('lessonId') lessonId: string, @Req() req: any) {
    return this.service.findAllForLesson(lessonId, req.user.userId, req.user.role);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.service.findOne(id, req.user.userId, req.user.role);
  }

  @Post()
  @Roles('teacher')
  create(@Param('lessonId') lessonId: string, @Body() dto: CreateQuestionDto, @Req() req: any) {
    return this.service.create(lessonId, dto, req.user.userId);
  }

  @Put(':id')
  @Roles('teacher')
  update(@Param('id') id: string, @Body() dto: UpdateQuestionDto, @Req() req: any) {
    return this.service.update(id, dto, req.user.userId);
  }

  @Delete(':id')
  @Roles('teacher')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.service.remove(id, req.user.userId);
  }

  @Get(':questionId/options')
  getOptions(@Param('questionId') questionId: string, @Req() req: any) {
    return this.service.getOptions(questionId, req.user.userId, req.user.role);
  }

  @Post(':questionId/options')
  @Roles('teacher')
  createOption(@Param('questionId') questionId: string, @Body() dto: CreateOptionDto, @Req() req: any) {
    return this.service.createOption(questionId, dto, req.user.userId);
  }

  @Put('options/:id')
  @Roles('teacher')
  updateOption(@Param('id') id: string, @Body() dto: UpdateOptionDto, @Req() req: any) {
    return this.service.updateOption(id, dto, req.user.userId);
  }

  @Delete('options/:id')
  @Roles('teacher')
  removeOption(@Param('id') id: string, @Req() req: any) {
    return this.service.removeOption(id, req.user.userId);
  }

  @Put(':questionId/options/reorder')
  @Roles('teacher')
  reorderOptions(@Param('questionId') questionId: string, @Body() optionIds: string[], @Req() req: any) {
    return this.service.reorderOptions(questionId, optionIds, req.user.userId);
  }
}