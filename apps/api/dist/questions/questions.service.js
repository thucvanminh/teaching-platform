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
exports.QuestionsService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../supabase/supabase.service");
let QuestionsService = class QuestionsService {
    constructor(supabase) {
        this.supabase = supabase;
    }
    async assertLessonOwner(lessonId, userId) {
        const { data: lesson } = await this.supabase.admin
            .from('lessons')
            .select('*, themes!inner(processes!inner(teacher_id, id))')
            .eq('id', lessonId)
            .single();
        if (!lesson)
            throw new common_1.NotFoundException('Lesson not found');
        if (lesson.themes?.processes?.teacher_id !== userId) {
            throw new common_1.ForbiddenException('Not your lesson');
        }
        return lesson;
    }
    async findAllForLesson(lessonId, userId, role) {
        const { data: lesson } = await this.supabase.admin
            .from('lessons')
            .select('*, themes!inner(process_id, processes!inner(teacher_id, id))')
            .eq('id', lessonId)
            .single();
        if (!lesson)
            throw new common_1.NotFoundException('Lesson not found');
        if (role === 'teacher') {
            if (lesson.themes?.processes?.teacher_id !== userId) {
                throw new common_1.ForbiddenException('Not your lesson');
            }
        }
        else {
            const processId = lesson.themes?.process_id;
            const { data: assigned } = await this.supabase.admin
                .from('student_processes')
                .select('id')
                .eq('student_id', userId)
                .eq('process_id', processId)
                .single();
            if (!assigned)
                throw new common_1.ForbiddenException('Lesson not assigned to you');
        }
        const { data: questions, error } = await this.supabase.admin
            .from('questions')
            .select('*, question_options(*)')
            .eq('lesson_id', lessonId)
            .order('order_index', { ascending: true });
        if (error)
            throw new common_1.BadRequestException(error.message);
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
    async findOne(id, userId, role) {
        const { data: question } = await this.supabase.admin
            .from('questions')
            .select('*, question_options(*), lessons!inner(themes!inner(process_id, processes!inner(teacher_id, id)))')
            .eq('id', id)
            .single();
        if (!question)
            throw new common_1.NotFoundException('Question not found');
        if (role === 'teacher') {
            if (question.lessons?.themes?.processes?.teacher_id !== userId) {
                throw new common_1.ForbiddenException('Not your question');
            }
            return question;
        }
        const processId = question.lessons?.themes?.process_id;
        const { data: assigned } = await this.supabase.admin
            .from('student_processes')
            .select('id')
            .eq('student_id', userId)
            .eq('process_id', processId)
            .single();
        if (!assigned)
            throw new common_1.ForbiddenException('Question not accessible');
        const { correct_answer, explanation, question_options, ...rest } = question;
        return {
            ...rest,
            question_options: question.question_options?.map(opt => {
                const { is_correct, ...optRest } = opt;
                return optRest;
            }),
        };
    }
    async create(lessonId, dto, teacherId) {
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
        if (error)
            throw new common_1.BadRequestException(error.message);
        return data;
    }
    async update(id, dto, teacherId) {
        const { data: question } = await this.supabase.admin
            .from('questions')
            .select('*, lessons!inner(themes!inner(processes!inner(teacher_id)))')
            .eq('id', id)
            .single();
        if (!question)
            throw new common_1.NotFoundException('Question not found');
        if (question.lessons?.themes?.processes?.teacher_id !== teacherId) {
            throw new common_1.ForbiddenException('Not your question');
        }
        const update = {};
        if (dto.content !== undefined)
            update.content = dto.content;
        if (dto.questionType !== undefined)
            update.question_type = dto.questionType;
        if (dto.correctAnswer !== undefined)
            update.correct_answer = dto.correctAnswer;
        if (dto.explanation !== undefined)
            update.explanation = dto.explanation;
        if (dto.orderIndex !== undefined)
            update.order_index = dto.orderIndex;
        if (dto.points !== undefined)
            update.points = dto.points;
        const { data } = await this.supabase.admin
            .from('questions')
            .update(update)
            .eq('id', id)
            .select()
            .single();
        return data;
    }
    async remove(id, teacherId) {
        const { data: question } = await this.supabase.admin
            .from('questions')
            .select('*, lessons!inner(themes!inner(processes!inner(teacher_id)))')
            .eq('id', id)
            .single();
        if (!question)
            throw new common_1.NotFoundException('Question not found');
        if (question.lessons?.themes?.processes?.teacher_id !== teacherId) {
            throw new common_1.ForbiddenException('Not your question');
        }
        await this.supabase.admin.from('questions').delete().eq('id', id);
    }
    async getOptions(questionId, userId, role) {
        const { data: question } = await this.supabase.admin
            .from('questions')
            .select('*, lessons!inner(themes!inner(process_id, processes!inner(teacher_id, id)))')
            .eq('id', questionId)
            .single();
        if (!question)
            throw new common_1.NotFoundException('Question not found');
        if (role === 'teacher') {
            if (question.lessons?.themes?.processes?.teacher_id !== userId) {
                throw new common_1.ForbiddenException('Not your question');
            }
        }
        else {
            const processId = question.lessons?.themes?.process_id;
            const { data: assigned } = await this.supabase.admin
                .from('student_processes')
                .select('id')
                .eq('student_id', userId)
                .eq('process_id', processId)
                .single();
            if (!assigned)
                throw new common_1.ForbiddenException('Not your question');
        }
        const { data, error } = await this.supabase.admin
            .from('question_options')
            .select('*')
            .eq('question_id', questionId)
            .order('order_index', { ascending: true });
        if (error)
            throw new common_1.BadRequestException(error.message);
        if (role === 'student') {
            return (data || []).map(opt => {
                const { is_correct, ...rest } = opt;
                return rest;
            });
        }
        return data || [];
    }
    async createOption(questionId, dto, teacherId) {
        const { data: question } = await this.supabase.admin
            .from('questions')
            .select('*, lessons!inner(themes!inner(processes!inner(teacher_id, id)))')
            .eq('id', questionId)
            .single();
        if (!question)
            throw new common_1.NotFoundException('Question not found');
        if (question.lessons?.themes?.processes?.teacher_id !== teacherId) {
            throw new common_1.ForbiddenException('Not your question');
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
        if (error)
            throw new common_1.BadRequestException(error.message);
        return data;
    }
    async updateOption(id, dto, teacherId) {
        const { data: option } = await this.supabase.admin
            .from('question_options')
            .select('*, questions!inner(lessons!inner(themes!inner(processes!inner(teacher_id, id))))')
            .eq('id', id)
            .single();
        if (!option)
            throw new common_1.NotFoundException('Option not found');
        if (option.questions?.lessons?.themes?.processes?.teacher_id !== teacherId) {
            throw new common_1.ForbiddenException('Not your option');
        }
        const update = {};
        if (dto.content !== undefined)
            update.content = dto.content;
        if (dto.orderIndex !== undefined)
            update.order_index = dto.orderIndex;
        if (dto.isCorrect !== undefined)
            update.is_correct = dto.isCorrect;
        const { data } = await this.supabase.admin
            .from('question_options')
            .update(update)
            .eq('id', id)
            .select()
            .single();
        return data;
    }
    async removeOption(id, teacherId) {
        const { data: option } = await this.supabase.admin
            .from('question_options')
            .select('*, questions!inner(lessons!inner(themes!inner(processes!inner(teacher_id, id))))')
            .eq('id', id)
            .single();
        if (!option)
            throw new common_1.NotFoundException('Option not found');
        if (option.questions?.lessons?.themes?.processes?.teacher_id !== teacherId) {
            throw new common_1.ForbiddenException('Not your option');
        }
        await this.supabase.admin.from('question_options').delete().eq('id', id);
    }
    async reorderOptions(questionId, optionIds, teacherId) {
        const { data: question } = await this.supabase.admin
            .from('questions')
            .select('*, lessons!inner(themes!inner(processes!inner(teacher_id, id)))')
            .eq('id', questionId)
            .single();
        if (!question)
            throw new common_1.NotFoundException('Question not found');
        if (question.lessons?.themes?.processes?.teacher_id !== teacherId) {
            throw new common_1.ForbiddenException('Not your question');
        }
        const updates = optionIds.map((id, index) => this.supabase.admin.from('question_options').update({ order_index: index }).eq('id', id));
        await Promise.all(updates);
        return { message: 'Reordered successfully' };
    }
};
exports.QuestionsService = QuestionsService;
exports.QuestionsService = QuestionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], QuestionsService);
//# sourceMappingURL=questions.service.js.map