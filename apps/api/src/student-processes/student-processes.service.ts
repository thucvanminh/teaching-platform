import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { AssignProcessDto } from './dto/assign-process.dto';

@Injectable()
export class StudentProcessesService {
  constructor(private supabase: SupabaseService) {}

  async findAllForUser(userId: string, role: string) {
    if (role === 'teacher') {
      const { data: assignments } = await this.supabase.admin
        .from('student_processes')
        .select('*, processes!inner(teacher_id, title), user_profiles!student_processes_student_id_fkey(full_name)')
        .eq('processes.teacher_id', userId);

      if (!assignments) return [];

      return assignments.map((sp) => ({
        id: sp.id,
        studentId: sp.student_id,
        studentName: (sp.user_profiles as any)?.full_name || '',
        processId: sp.process_id,
        processTitle: (sp.processes as any)?.title || '',
        assignedAt: sp.assigned_at,
      }));
    }

    const { data: assignments } = await this.supabase.admin
      .from('student_processes')
      .select('*, processes(title)')
      .eq('student_id', userId);

    if (!assignments) return [];

    return assignments.map((sp) => ({
      id: sp.id,
      studentId: sp.student_id,
      studentName: '',
      processId: sp.process_id,
      processTitle: (sp.processes as any)?.title || '',
      assignedAt: sp.assigned_at,
    }));
  }

  async getStudents() {
    const { data: students } = await this.supabase.admin
      .from('user_profiles')
      .select('id, full_name')
      .eq('role', 'student');

    return (students || []).map((s) => ({ id: s.id, fullName: s.full_name }));
  }

  async assign(dto: AssignProcessDto, teacherId: string) {
    const { data: process } = await this.supabase.admin
      .from('processes')
      .select('teacher_id')
      .eq('id', dto.processId)
      .single();

    if (!process) throw new NotFoundException('Process not found');
    if (process.teacher_id !== teacherId) {
      throw new ForbiddenException('Not your process');
    }

    const { data: existing } = await this.supabase.admin
      .from('student_processes')
      .select('id')
      .eq('student_id', dto.studentId)
      .eq('process_id', dto.processId)
      .single();

    if (existing) throw new ConflictException('Already assigned');

    const { error } = await this.supabase.admin
      .from('student_processes')
      .insert({ student_id: dto.studentId, process_id: dto.processId });

    if (error) throw new Error(error.message);
    return { message: 'Assigned successfully' };
  }

  async unassign(id: string, teacherId: string) {
    const { data: sp } = await this.supabase.admin
      .from('student_processes')
      .select('*, processes(teacher_id)')
      .eq('id', id)
      .single();

    if (!sp) throw new NotFoundException('Assignment not found');
    if ((sp.processes as any)?.teacher_id !== teacherId) {
      throw new ForbiddenException('Not your process');
    }

    await this.supabase.admin.from('student_processes').delete().eq('id', id);
  }
}
