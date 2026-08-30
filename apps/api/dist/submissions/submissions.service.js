"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmissionsService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../supabase/supabase.service");
let SubmissionsService = class SubmissionsService {
    constructor(supabase) {
        this.supabase = supabase;
    }
    async createSubmission(dto, studentId) {
        const { data: lesson } = await this.supabase.admin
            .from('lessons')
            .select('*, themes!inner(process_id)')
            .eq('id', dto.lessonId)
            .single();
        if (!lesson)
            throw new common_1.NotFoundException('Lesson not found');
        const processId = lesson.themes?.process_id;
        const { data: assigned } = await this.supabase.admin
            .from('student_processes')
            .select('id')
            .eq('student_id', studentId)
            .eq('process_id', processId)
            .single();
        if (!assigned)
            throw new common_1.ForbiddenException('Lesson not assigned to you');
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
        if (error)
            throw new common_1.BadRequestException(error.message);
        return data;
    }
    async gradeSubmission(submissionId, dto, studentId) {
        const { data: submission } = await this.supabase.admin
            .from('submissions')
            .select('*')
            .eq('id', submissionId)
            .single();
        if (!submission)
            throw new common_1.NotFoundException('Submission not found');
        if (submission.student_id !== studentId)
            throw new common_1.ForbiddenException('Not your submission');
        if (submission.status !== 'in_progress')
            throw new common_1.ConflictException('Submission already completed');
        const { data: questions } = await this.supabase.admin
            .from('questions')
            .select('*, question_options(*)')
            .eq('lesson_id', submission.lesson_id)
            .order('order_index', { ascending: true });
        if (!questions || questions.length === 0) {
            throw new common_1.BadRequestException('No questions found for this lesson');
        }
        let totalScore = 0;
        let earnedScore = 0;
        const answersToInsert = [];
        for (const question of questions) {
            totalScore += question.points;
            const studentAnswer = dto.answers.find(a => a.questionId === question.id);
            let isCorrect = false;
            let selectedOptionId = null;
            let essayAnswer = null;
            if (question.question_type === 'mc') {
                selectedOptionId = studentAnswer?.selectedOptionId || null;
                if (selectedOptionId) {
                    const correctOption = question.question_options?.find((o) => o.is_correct);
                    isCorrect = correctOption ? selectedOptionId === correctOption.id : false;
                }
            }
            else {
                essayAnswer = studentAnswer?.essayAnswer || null;
                if (essayAnswer) {
                    isCorrect = essayAnswer.toLowerCase().trim() === (question.correct_answer || '').toLowerCase().trim();
                }
            }
            if (isCorrect)
                earnedScore += question.points;
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
    async getSubmissionReview(submissionId, userId, role) {
        const { data: submission } = await this.supabase.admin
            .from('submissions')
            .select('*, lessons!inner(title)')
            .eq('id', submissionId)
            .single();
        if (!submission)
            throw new common_1.NotFoundException('Submission not found');
        if (role === 'student' && submission.student_id !== userId) {
            throw new common_1.ForbiddenException('Not your submission');
        }
        if (role === 'teacher') {
            const { data: lesson } = await this.supabase.admin
                .from('lessons')
                .select('*, themes!inner(processes!inner(teacher_id))')
                .eq('id', submission.lesson_id)
                .single();
            if (lesson?.themes?.processes?.teacher_id !== userId) {
                throw new common_1.ForbiddenException('Not your lesson');
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
                questionContent: a.questions?.content,
                questionType: a.questions?.question_type,
                selectedOptionId: a.selected_option_id,
                essayAnswer: a.essay_answer,
                isCorrect: a.is_correct,
                correctAnswer: a.questions?.correct_answer,
                explanation: a.questions?.explanation,
                points: a.questions?.points,
                options: a.questions?.question_options || [],
            })),
        };
    }
    async getSubmissionHistory(lessonId, studentId) {
        const { data, error } = await this.supabase.admin
            .from('submissions')
            .select('*')
            .eq('lesson_id', lessonId)
            .eq('student_id', studentId)
            .order('attempt_number', { ascending: false });
        if (error)
            throw new common_1.BadRequestException(error.message);
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
    async getSubmissionsForTeacher(lessonId, teacherId) {
        const { data: lesson } = await this.supabase.admin
            .from('lessons')
            .select('*, themes!inner(processes!inner(teacher_id, id))')
            .eq('id', lessonId)
            .single();
        if (!lesson)
            throw new common_1.NotFoundException('Lesson not found');
        if (lesson.themes?.processes?.teacher_id !== teacherId) {
            throw new common_1.ForbiddenException('Not your lesson');
        }
        const { data, error } = await this.supabase.admin
            .from('submissions')
            .select('*, user_profiles!submissions_student_id_fkey(full_name)')
            .eq('lesson_id', lessonId)
            .order('attempt_number', { ascending: false });
        if (error)
            throw new common_1.BadRequestException(error.message);
        return (data || []).map(s => ({
            id: s.id,
            studentId: s.student_id,
            studentName: s.user_profiles?.full_name || '',
            attemptNumber: s.attempt_number,
            status: s.status,
            score: s.score,
            maxScore: s.max_score,
            scorePercent: s.max_score > 0 ? Math.round((s.score / s.max_score) * 100) : 0,
            submittedAt: s.submitted_at,
        }));
    }
};
exports.SubmissionsService = SubmissionsService;
exports.SubmissionsService = SubmissionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], SubmissionsService);
//# sourceMappingURL=submissions.service.js.map