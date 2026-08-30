import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateQuestionDto, UpdateQuestionDto, CreateOptionDto, UpdateOptionDto } from './dto/question.dto';

@Injectable()
export class QuestionsService {
  constructor(private supabase: SupabaseService) {}

  private async assertLessonOwner(lessonId: string, userId: string) {
    const { data: lesson } = await this.supabase.admin
      .from('lessons')
      .select('*, themes!inner(processes!inner(teacher_id, id))')
      .eq('id', lessonId)
      .single();

    if (!lesson) throw new NotFoundException('Lesson not found');
    if ((lesson as any).themes?.processes?.teacher_id !== userId) {
      throw new ForbiddenException('Not your lesson');
    }
    return lesson;
  }

  async findAllForLesson(lessonId: string, userId: string, role: string) {
    const { data: lesson } = await this.supabase.admin
      .from('lessons')
      .select('*, themes!inner(process_id, processes!inner(teacher_id, id))')
      .eq('id', lessonId)
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

    const { data: questions, error } = await this.supabase.admin
      .from('questions')
      .select('*, question_options(*)')
      .eq('lesson_id', lessonId)
      .order('order_index', { ascending: true });

    if (error) throw new BadRequestException(error.message);

    if (role === 'student') {
      return (questions || []).map(q => {
        const { correct_answer, explanation, question_options, ...rest } = q;
        return {
          ...rest,
          question_options: q.question_options?.map(opt => {
            const { is_correct, ...optRest } = opt;
            return optRest;
          }),
        };
      });
    }

    return questions || [];
  }

  async findOne(id: string, userId: string, role: string) {
    const { data: question } = await this.supabase.admin
      .from('questions')
      .select('*, question_options(*), lessons!inner(themes!inner(process_id, processes!inner(teacher_id, id)))')
      .eq('id', id)
      .single();

    if (!question) throw new NotFoundException('Question not found');

    if (role === 'teacher') {
      if ((question as any).lessons?.themes?.processes?.teacher_id !== userId) {
        throw new ForbiddenException('Not your question');
      }
      return question;
    }

    const processId = (question as any).lessons?.themes?.process_id;
    const { data: assigned } = await this.supabase.admin
      .from('student_processes')
      .select('id')
      .eq('student_id', userId)
      .eq('process_id', processId)
      .single();

    if (!assigned) throw new ForbiddenException('Question not accessible');

    const { correct_answer, explanation, question_options, ...rest } = question;
    return {
      ...rest,
      question_options: question.question_options?.map(opt => {
        const { is_correct, ...optRest } = opt;
        return optRest;
      }),
    };
  }

  async create(lessonId: string, dto: CreateQuestionDto, teacherId: string) {
    await this.assertLessonOwner(lessonId, teacherId);

    const { data, error } = await this.supabase.admin
      .from('questions')
      .insert({
        lesson_id: lessonId,
        content: dto.content,
        question_type: dto.questionType,
        correct_answer: dto.correctAnswer,
        explanation: dto.explanation,
        order_index: dto.orderIndex || 0,
        points: dto.points || 1,
      })
      .select()
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async update(id: string, dto: UpdateQuestionDto, teacherId: string) {
    const { data: question } = await this.supabase.admin
      .from('questions')
      .select('*, lessons!inner(themes!inner(processes!inner(teacher_id)))')
      .eq('id', id)
      .single();

    if (!question) throw new NotFoundException('Question not found');
    if ((question as any).lessons?.themes?.processes?.teacher_id !== teacherId) {
      throw new ForbiddenException('Not your question');
    }

    const update: Record<string, any> = {};
    if (dto.content !== undefined) update.content = dto.content;
    if (dto.questionType !== undefined) update.question_type = dto.questionType;
    if (dto.correctAnswer !== undefined) update.correct_answer = dto.correctAnswer;
    if (dto.explanation !== undefined) update.explanation = dto.explanation;
    if (dto.orderIndex !== undefined) update.order_index = dto.orderIndex;
    if (dto.points !== undefined) update.points = dto.points;

    const { data } = await this.supabase.admin
      .from('questions')
      .update(update)
      .eq('id', id)
      .select()
      .single();

    return data;
  }

  async remove(id: string, teacherId: string) {
    const { data: question } = await this.supabase.admin
      .from('questions')
      .select('*, lessons!inner(themes!inner(processes!inner(teacher_id)))')
      .eq('id', id)
      .single();

    if (!question) throw new NotFoundException('Question not found');
    if ((question as any).lessons?.themes?.processes?.teacher_id !== teacherId) {
      throw new ForbiddenException('Not your question');
    }

    await this.supabase.admin.from('questions').delete().eq('id', id);
  }

  // Options
  async getOptions(questionId: string, userId: string, role: string) {
    const { data: question } = await this.supabase.admin
      .from('questions')
      .select('*, lessons!inner(themes!inner(process_id, processes!inner(teacher_id, id)))')
      .eq('id', questionId)
      .single();

    if (!question) throw new NotFoundException('Question not found');

    if (role === 'teacher') {
      if ((question as any).lessons?.themes?.processes?.teacher_id !== userId) {
        throw new ForbiddenException('Not your question');
      }
    } else {
      const processId = (question as any).lessons?.themes?.process_id;
      const { data: assigned } = await this.supabase.admin
        .from('student_processes')
        .select('id')
        .eq('student_id', userId)
        .eq('process_id', processId)
        .single();

      if (!assigned) throw new ForbiddenException('Not your question');
    }

    const { data, error } = await this.supabase.admin
      .from('question_options')
      .select('*')
      .eq('question_id', questionId)
      .order('order_index', { ascending: true });

    if (error) throw new BadRequestException(error.message);

    if (role === 'student') {
      return (data || []).map(opt => {
        const { is_correct, ...rest } = opt;
        return rest;
      });
    }

    return data || [];
  }

  async createOption(questionId: string, dto: CreateOptionDto, teacherId: string) {
    const { data: question } = await this.supabase.admin
      .from('questions')
      .select('*, lessons!inner(themes!inner(processes!inner(teacher_id, id)))')
      .eq('id', questionId)
      .single();

    if (!question) throw new NotFoundException('Question not found');
    if ((question as any).lessons?.themes?.processes?.teacher_id !== teacherId) {
      throw new ForbiddenException('Not your question');
    }

    const { data, error } = await this.supabase.admin
      .from('question_options')
      .insert({
        question_id: questionId,
        content: dto.content,
        is_correct: dto.isCorrect || false,
        order_index: dto.orderIndex || 0,
      })
      .select()
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async updateOption(id: string, dto: UpdateOptionDto, teacherId: string) {
    const { data: option } = await this.supabase.admin
      .from('question_options')
      .select('*, questions!inner(lessons!inner(themes!inner(processes!inner(teacher_id, id))))')
      .eq('id', id)
      .single();

    if (!option) throw new NotFoundException('Option not found');
    if ((option as any).questions?.lessons?.themes?.processes?.teacher_id !== teacherId) {
      throw new ForbiddenException('Not your option');
    }

    const update: Record<string, any> = {};
    if (dto.content !== undefined) update.content = dto.content;
    if (dto.orderIndex !== undefined) update.order_index = dto.orderIndex;
    if (dto.isCorrect !== undefined) update.is_correct = dto.isCorrect;

    const { data } = await this.supabase.admin
      .from('question_options')
      .update(update)
      .eq('id', id)
      .select()
      .single();

    return data;
  }

  async removeOption(id: string, teacherId: string) {
    const { data: option } = await this.supabase.admin
      .from('question_options')
      .select('*, questions!inner(lessons!inner(themes!inner(processes!inner(teacher_id, id))))')
      .eq('id', id)
      .single();

    if (!option) throw new NotFoundException('Option not found');
    if ((option as any).questions?.lessons?.themes?.processes?.teacher_id !== teacherId) {
      throw new ForbiddenException('Not your option');
    }

    await this.supabase.admin.from('question_options').delete().eq('id', id);
  }

  async reorderOptions(questionId: string, optionIds: string[], teacherId: string) {
    const { data: question } = await this.supabase.admin
      .from('questions')
      .select('*, lessons!inner(themes!inner(processes!inner(teacher_id, id)))')
      .eq('id', questionId)
      .single();

    if (!question) throw new NotFoundException('Question not found');
    if ((question as any).lessons?.themes?.processes?.teacher_id !== teacherId) {
      throw new ForbiddenException('Not your question');
    }

    const updates = optionIds.map((id, index) =>
      this.supabase.admin.from('question_options').update({ order_index: index }).eq('id', id)
    );

    await Promise.all(updates);
    return { message: 'Reordered successfully' };
  }
}