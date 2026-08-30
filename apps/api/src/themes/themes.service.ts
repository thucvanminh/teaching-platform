import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateThemeDto, UpdateThemeDto } from './dto/theme.dto';

@Injectable()
export class ThemesService {
  constructor(private supabase: SupabaseService) {}

  async findAllForProcess(processId: string, userId: string, role: string) {
    if (role === 'teacher') {
      const { data: process } = await this.supabase.admin
        .from('processes')
        .select('teacher_id')
        .eq('id', processId)
        .single();

      if (!process) throw new NotFoundException('Process not found');
      if (process.teacher_id !== userId) throw new ForbiddenException('Not your process');
    } else {
      const { data: assigned } = await this.supabase.admin
        .from('student_processes')
        .select('id')
        .eq('student_id', userId)
        .eq('process_id', processId)
        .single();

      if (!assigned) throw new ForbiddenException('Process not assigned to you');
    }

    const { data, error } = await this.supabase.admin
      .from('themes')
      .select('*')
      .eq('process_id', processId)
      .order('order_index', { ascending: true });

    if (error) throw new BadRequestException(error.message);
    return data || [];
  }

  async findOne(id: string, userId: string, role: string) {
    const { data: theme } = await this.supabase.admin
      .from('themes')
      .select('*, processes(teacher_id)')
      .eq('id', id)
      .single();

    if (!theme) throw new NotFoundException('Theme not found');

    if (role === 'teacher') {
      if ((theme.processes as any)?.teacher_id !== userId) {
        throw new ForbiddenException('Not your theme');
      }
    } else {
      const { data: assigned } = await this.supabase.admin
        .from('student_processes')
        .select('id')
        .eq('student_id', userId)
        .eq('process_id', theme.process_id)
        .single();

      if (!assigned) throw new ForbiddenException('Theme not accessible');
    }

    return theme;
  }

  async create(processId: string, dto: CreateThemeDto, teacherId: string) {
    const { data: process } = await this.supabase.admin
      .from('processes')
      .select('teacher_id')
      .eq('id', processId)
      .single();

    if (!process) throw new NotFoundException('Process not found');
    if (process.teacher_id !== teacherId) throw new ForbiddenException('Not your process');

    const { data, error } = await this.supabase.admin
      .from('themes')
      .insert({
        process_id: processId,
        title: dto.title,
        description: dto.description,
        order_index: dto.orderIndex || 0,
      })
      .select()
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async update(id: string, dto: UpdateThemeDto, teacherId: string) {
    const { data: theme } = await this.supabase.admin
      .from('themes')
      .select('*, processes(teacher_id)')
      .eq('id', id)
      .single();

    if (!theme) throw new NotFoundException('Theme not found');
    if ((theme.processes as any)?.teacher_id !== teacherId) {
      throw new ForbiddenException('Not your theme');
    }

    const update: Record<string, any> = {};
    if (dto.title !== undefined) update.title = dto.title;
    if (dto.description !== undefined) update.description = dto.description;
    if (dto.orderIndex !== undefined) update.order_index = dto.orderIndex;

    const { data } = await this.supabase.admin
      .from('themes')
      .update(update)
      .eq('id', id)
      .select()
      .single();

    return data;
  }

  async remove(id: string, teacherId: string) {
    const { data: theme } = await this.supabase.admin
      .from('themes')
      .select('*, processes(teacher_id)')
      .eq('id', id)
      .single();

    if (!theme) throw new NotFoundException('Theme not found');
    if ((theme.processes as any)?.teacher_id !== teacherId) {
      throw new ForbiddenException('Not your theme');
    }

    await this.supabase.admin.from('themes').delete().eq('id', id);
  }

  async reorder(processId: string, themeIds: string[], teacherId: string) {
    const { data: process } = await this.supabase.admin
      .from('processes')
      .select('teacher_id')
      .eq('id', processId)
      .single();

    if (!process) throw new NotFoundException('Process not found');
    if (process.teacher_id !== teacherId) throw new ForbiddenException('Not your process');

    const updates = themeIds.map((id, index) =>
      this.supabase.admin.from('themes').update({ order_index: index }).eq('id', id)
    );

    await Promise.all(updates);
    return { message: 'Reordered successfully' };
  }
}