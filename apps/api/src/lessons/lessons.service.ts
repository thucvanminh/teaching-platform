import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
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

  async create(processId: string, dto: CreateLessonDto, teacherId: string) {
    await this.assertProcessOwner(processId, teacherId);

    const { data, error } = await this.supabase.admin
      .from('lessons')
      .insert({
        process_id: processId,
        title: dto.title,
        description: dto.description,
        lesson_type: dto.lessonType,
        content_url: dto.contentUrl,
        order_index: dto.orderIndex,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      lessonType: data.lesson_type,
      contentUrl: data.content_url,
      orderIndex: data.order_index,
    };
  }

  async update(id: string, dto: UpdateLessonDto, teacherId: string) {
    const { data: lesson } = await this.supabase.admin
      .from('lessons')
      .select('*, processes(teacher_id)')
      .eq('id', id)
      .single();

    if (!lesson) throw new NotFoundException('Lesson not found');
    if ((lesson.processes as any)?.teacher_id !== teacherId) {
      throw new ForbiddenException('Not your lesson');
    }

    const update: Record<string, any> = {};
    if (dto.title !== undefined) update.title = dto.title;
    if (dto.description !== undefined) update.description = dto.description;
    if (dto.lessonType !== undefined) update.lesson_type = dto.lessonType;
    if (dto.contentUrl !== undefined) update.content_url = dto.contentUrl;
    if (dto.orderIndex !== undefined) update.order_index = dto.orderIndex;

    const { data } = await this.supabase.admin
      .from('lessons')
      .update(update)
      .eq('id', id)
      .select()
      .single();

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      lessonType: data.lesson_type,
      contentUrl: data.content_url,
      orderIndex: data.order_index,
    };
  }

  async remove(id: string, teacherId: string) {
    const { data: lesson } = await this.supabase.admin
      .from('lessons')
      .select('*, processes(teacher_id)')
      .eq('id', id)
      .single();

    if (!lesson) throw new NotFoundException('Lesson not found');
    if ((lesson.processes as any)?.teacher_id !== teacherId) {
      throw new ForbiddenException('Not your lesson');
    }

    await this.supabase.admin.from('lessons').delete().eq('id', id);
  }
}
