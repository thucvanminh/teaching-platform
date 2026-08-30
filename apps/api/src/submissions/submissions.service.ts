import { Injectable, NotFoundException, ForbiddenException, BadRequestException, ConflictException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class SubmissionsService {
  constructor(private supabase: SupabaseService) {}

  async createSubmission(dto: { lessonId: string }, studentId: string) {
    const { data: lesson } = await this.supabase.admin
      .from('lessons')
      .select('*, themes!inner(process_id)')
      .eq('id', dto.lessonId)
      .single();

    if (!lesson) throw new NotFoundException('Lesson not found');

    const processId = (lesson as any).themes?.process_id;
    const { data: assigned } = await this.supabase.admin
      .from('student_processes')
      .select('id')
      .eq('student_id', studentId)
      .eq('process_id', processId)
      .single();

    if (!assigned) throw new ForbiddenException('Lesson not assigned to you');

    const { count } = await this.supabase.admin
      .from('submissions')
      .select('id', { count: 'exact', head: true })
      .eq('student_id', studentId)
      .eq('lesson_id', dto.lessonId);

    const attemptNumber = (count || 0) + 1;

    const { data, error } = await this.supabase.admin
      .from('submissions')
      .insert({
        student_id: studentId,
        lesson_id: dto.lessonId,
        attempt_number: attemptNumber,
        status: 'in_progress',
      })
      .select()
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async gradeSubmission(submissionId: string, dto: { answers: { questionId: string; selectedOptionId?: string; essayAnswer?: string }[] }, studentId: string) {
    const { data: submission } = await this.supabase.admin
      .from('submissions')
      .select('*')
      .eq('id', submissionId)
      .single();

    if (!submission) throw new NotFoundException('Submission not found');
    if (submission.student_id !== studentId) throw new ForbiddenException('Not your submission');
    if (submission.status !== 'in_progress') throw new ConflictException('Submission already completed');

    const { data: questions } = await this.supabase.admin
      .from('questions')
      .select('*, question_options(*)')
      .eq('lesson_id', submission.lesson_id)
      .order('order_index', { ascending: true });

    if (!questions || questions.length === 0) {
      throw new BadRequestException('No questions found for this lesson');
    }

    let totalScore = 0;
    let earnedScore = 0;
    const answersToInsert: any[] = [];

    for (const question of questions) {
      totalScore += question.points;

      const studentAnswer = dto.answers.find(a => a.questionId === question.id);
      let isCorrect = false;
      let selectedOptionId: string | null = null;
      let essayAnswer: string | null = null;

      if (question.question_type === 'mc') {
        selectedOptionId = studentAnswer?.selectedOptionId || null;
        if (selectedOptionId) {
          const correctOption = (question as any).question_options?.find((o: any) => o.is_correct);
          isCorrect = correctOption ? selectedOptionId === correctOption.id : false;
        }
      } else {
        essayAnswer = studentAnswer?.essayAnswer || null;
        if (essayAnswer) {
          isCorrect = essayAnswer.toLowerCase().trim() === (question.correct_answer || '').toLowerCase().trim();
        }
      }

      if (isCorrect) earnedScore += question.points;

      answersToInsert.push({
        submission_id: submissionId,
        question_id: question.id,
        selected_option_id: selectedOptionId,
        essay_answer: essayAnswer,
        is_correct: isCorrect,
        answered_at: new Date().toISOString(),
      });
    }

    if (answersToInsert.length > 0) {
      await this.supabase.admin.from('student_answers').insert(answersToInsert);
    }

    const { data: updatedSubmission } = await this.supabase.admin
      .from('submissions')
      .update({
        score: earnedScore,
        max_score: totalScore,
        status: 'completed',
        submitted_at: new Date().toISOString(),
      })
      .eq('id', submissionId)
      .select()
      .single();

    return {
      submission: updatedSubmission,
      totalScore,
      earnedScore,
      scorePercent: totalScore > 0 ? Math.round((earnedScore / totalScore) * 100) : 0,
    };
  }

  async getSubmissionReview(submissionId: string, userId: string, role: string) {
    const { data: submission } = await this.supabase.admin
      .from('submissions')
      .select('*, lessons!inner(title)')
      .eq('id', submissionId)
      .single();

    if (!submission) throw new NotFoundException('Submission not found');

    if (role === 'student' && submission.student_id !== userId) {
      throw new ForbiddenException('Not your submission');
    }

    if (role === 'teacher') {
      const { data: lesson } = await this.supabase.admin
        .from('lessons')
        .select('*, themes!inner(processes!inner(teacher_id))')
        .eq('id', submission.lesson_id)
        .single();

      if ((lesson as any)?.themes?.processes?.teacher_id !== userId) {
        throw new ForbiddenException('Not your lesson');
      }
    }

    const { data: answers } = await this.supabase.admin
      .from('student_answers')
      .select('*, questions!inner(content, question_type, correct_answer, explanation, points, question_options(*))')
      .eq('submission_id', submissionId);

    return {
      submission,
      answers: (answers || []).map(a => ({
        id: a.id,
        questionId: a.question_id,
        questionContent: (a as any).questions?.content,
        questionType: (a as any).questions?.question_type,
        selectedOptionId: a.selected_option_id,
        essayAnswer: a.essay_answer,
        isCorrect: a.is_correct,
        correctAnswer: (a as any).questions?.correct_answer,
        explanation: (a as any).questions?.explanation,
        points: (a as any).questions?.points,
        options: (a as any).questions?.question_options || [],
      })),
    };
  }

  async getSubmissionHistory(lessonId: string, studentId: string) {
    const { data, error } = await this.supabase.admin
      .from('submissions')
      .select('*')
      .eq('lesson_id', lessonId)
      .eq('student_id', studentId)
      .order('attempt_number', { ascending: false });

    if (error) throw new BadRequestException(error.message);
    return (data || []).map(s => ({
      id: s.id,
      attemptNumber: s.attempt_number,
      score: s.score,
      maxScore: s.max_score,
      scorePercent: s.max_score > 0 ? Math.round((s.score / s.max_score) * 100) : 0,
      status: s.status,
      submittedAt: s.submitted_at,
    }));
  }

  async getSubmissionsForTeacher(lessonId: string, teacherId: string) {
    const { data: lesson } = await this.supabase.admin
      .from('lessons')
      .select('*, themes!inner(processes!inner(teacher_id, id))')
      .eq('id', lessonId)
      .single();

    if (!lesson) throw new NotFoundException('Lesson not found');
    if ((lesson as any).themes?.processes?.teacher_id !== teacherId) {
      throw new ForbiddenException('Not your lesson');
    }

    const { data, error } = await this.supabase.admin
      .from('submissions')
      .select('*, user_profiles!submissions_student_id_fkey(full_name)')
      .eq('lesson_id', lessonId)
      .order('attempt_number', { ascending: false });

    if (error) throw new BadRequestException(error.message);

    return (data || []).map(s => ({
      id: s.id,
      studentId: s.student_id,
      studentName: (s as any).user_profiles?.full_name || '',
      attemptNumber: s.attempt_number,
      status: s.status,
      score: s.score,
      maxScore: s.max_score,
      scorePercent: s.max_score > 0 ? Math.round((s.score / s.max_score) * 100) : 0,
      submittedAt: s.submitted_at,
    }));
  }
}