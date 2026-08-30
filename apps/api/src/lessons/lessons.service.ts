import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateLessonDto, UpdateLessonDto } from './dto/lesson.dto';

@Injectable()
export class LessonsService {
  constructor(private supabase: SupabaseService) {}

  private async assertProcessOwner(processId: string, teacherId: string) {
    const { data: process } = await this.supabase.admin
      .from('processes')
      .select('teacher_id')
      .eq('id', processId)
      .single();

    if (!process) throw new NotFoundException('Process not found');
    if (process.teacher_id !== teacherId) {
      throw new ForbiddenException('Not your process');
    }
  }

  private async assertThemeOwner(themeId: string, teacherId: string) {
    const { data: theme } = await this.supabase.admin
      .from('themes')
      .select('*, processes!inner(teacher_id, id)')
      .eq('id', themeId)
      .single();

    if (!theme) throw new NotFoundException('Theme not found');
    if ((theme as any).processes?.teacher_id !== teacherId) {
      throw new ForbiddenException('Not your theme');
    }
    return theme;
  }

  async findAllForTheme(themeId: string, userId: string, role: string) {
    const { data: theme } = await this.supabase.admin
      .from('themes')
      .select('*, processes!inner(teacher_id, id)')
      .eq('id', themeId)
      .single();

    if (!theme) throw new NotFoundException('Theme not found');

    if (role === 'teacher') {
      if ((theme as any).processes?.teacher_id !== userId) {
        throw new ForbiddenException('Not your theme');
      }
    } else {
      const processId = (theme as any).process_id;
      const { data: assigned } = await this.supabase.admin
        .from('student_processes')
        .select('id')
        .eq('student_id', userId)
        .eq('process_id', processId)
        .single();

      if (!assigned) throw new ForbiddenException('Theme not assigned to you');
    }

    const { data, error } = await this.supabase.admin
      .from('lessons')
      .select('*')
      .eq('theme_id', themeId)
      .order('order_index', { ascending: true });

    if (error) throw new BadRequestException(error.message);
    return data || [];
  }

  async findOne(id: string, userId: string, role: string) {
    const { data: lesson } = await this.supabase.admin
      .from('lessons')
      .select('*, themes!inner(process_id, processes!inner(teacher_id, id))')
      .eq('id', id)
      .single();

    if (!lesson) throw new NotFoundException('Lesson not found');

    if (role === 'teacher') {
      if ((lesson as any).themes?.processes?.teacher_id !== userId) {
        throw new ForbiddenException('Not your lesson');
      }
    } else {
      const processId = (lesson as any).themes?.process_id;
      const { data: assigned } = await this.supabase.admin
        .from('student_processes')
        .select('id')
        .eq('student_id', userId)
        .eq('process_id', processId)
        .single();

      if (!assigned) throw new ForbiddenException('Lesson not assigned to you');
    }

    return lesson;
  }

  async createForTheme(themeId: string, dto: CreateLessonDto, teacherId: string) {
    await this.assertThemeOwner(themeId, teacherId);

    const { data: theme } = await this.supabase.admin
      .from('themes')
      .select('process_id')
      .eq('id', themeId)
      .single();

    const insert: Record<string, any> = {
      theme_id: themeId,
      process_id: (theme as any).process_id,
      title: dto.title,
      description: dto.description,
      lesson_type: dto.lessonType,
      content_url: dto.contentUrl,
      order_index: dto.orderIndex || 0,
    };

    const { data, error } = await this.supabase.admin
      .from('lessons')
      .insert(insert)
      .select()
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async create(processId: string, dto: CreateLessonDto, teacherId: string) {
    await this.assertProcessOwner(processId, teacherId);

    const insert: Record<string, any> = {
      process_id: processId,
      title: dto.title,
      description: dto.description,
      lesson_type: dto.lessonType,
      content_url: dto.contentUrl,
      order_index: dto.orderIndex,
    };
    if (dto.themeId !== undefined) insert.theme_id = dto.themeId;

    const { data, error } = await this.supabase.admin
      .from('lessons')
      .insert(insert)
      .select()
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async update(id: string, dto: UpdateLessonDto, teacherId: string) {
    const { data: lesson } = await this.supabase.admin
      .from('lessons')
      .select('*, themes!inner(processes!inner(teacher_id, id))')
      .eq('id', id)
      .single();

    if (!lesson) throw new NotFoundException('Lesson not found');
    if ((lesson as any).themes?.processes?.teacher_id !== teacherId) {
      throw new ForbiddenException('Not your lesson');
    }

    const update: Record<string, any> = {};
    if (dto.title !== undefined) update.title = dto.title;
    if (dto.description !== undefined) update.description = dto.description;
    if (dto.lessonType !== undefined) update.lesson_type = dto.lessonType;
    if (dto.contentUrl !== undefined) update.content_url = dto.contentUrl;
    if (dto.orderIndex !== undefined) update.order_index = dto.orderIndex;
    if (dto.themeId !== undefined) update.theme_id = dto.themeId;

    const { data } = await this.supabase.admin
      .from('lessons')
      .update(update)
      .eq('id', id)
      .select()
      .single();

    return data;
  }

  async remove(id: string, teacherId: string) {
    const { data: lesson } = await this.supabase.admin
      .from('lessons')
      .select('*, themes!inner(processes!inner(teacher_id, id))')
      .eq('id', id)
      .single();

    if (!lesson) throw new NotFoundException('Lesson not found');
    if ((lesson as any).themes?.processes?.teacher_id !== teacherId) {
      throw new ForbiddenException('Not your lesson');
    }

    await this.supabase.admin.from('lessons').delete().eq('id', id);
  }
}