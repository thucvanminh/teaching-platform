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
exports.LessonsService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../supabase/supabase.service");
let LessonsService = class LessonsService {
    constructor(supabase) {
        this.supabase = supabase;
    }
    async assertProcessOwner(processId, teacherId) {
        const { data: process } = await this.supabase.admin
            .from('processes')
            .select('teacher_id')
            .eq('id', processId)
            .single();
        if (!process)
            throw new common_1.NotFoundException('Process not found');
        if (process.teacher_id !== teacherId) {
            throw new common_1.ForbiddenException('Not your process');
        }
    }
    async assertThemeOwner(themeId, teacherId) {
        const { data: theme } = await this.supabase.admin
            .from('themes')
            .select('*, processes!inner(teacher_id, id)')
            .eq('id', themeId)
            .single();
        if (!theme)
            throw new common_1.NotFoundException('Theme not found');
        if (theme.processes?.teacher_id !== teacherId) {
            throw new common_1.ForbiddenException('Not your theme');
        }
        return theme;
    }
    async findAllForTheme(themeId, userId, role) {
        const { data: theme } = await this.supabase.admin
            .from('themes')
            .select('*, processes!inner(teacher_id, id)')
            .eq('id', themeId)
            .single();
        if (!theme)
            throw new common_1.NotFoundException('Theme not found');
        if (role === 'teacher') {
            if (theme.processes?.teacher_id !== userId) {
                throw new common_1.ForbiddenException('Not your theme');
            }
        }
        else {
            const processId = theme.process_id;
            const { data: assigned } = await this.supabase.admin
                .from('student_processes')
                .select('id')
                .eq('student_id', userId)
                .eq('process_id', processId)
                .single();
            if (!assigned)
                throw new common_1.ForbiddenException('Theme not assigned to you');
        }
        const { data, error } = await this.supabase.admin
            .from('lessons')
            .select('*')
            .eq('theme_id', themeId)
            .order('order_index', { ascending: true });
        if (error)
            throw new common_1.BadRequestException(error.message);
        return data || [];
    }
    async findOne(id, userId, role) {
        const { data: lesson } = await this.supabase.admin
            .from('lessons')
            .select('*, themes!inner(process_id, processes!inner(teacher_id, id))')
            .eq('id', id)
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
        return lesson;
    }
    async createForTheme(themeId, dto, teacherId) {
        await this.assertThemeOwner(themeId, teacherId);
        const { data: theme } = await this.supabase.admin
            .from('themes')
            .select('process_id')
            .eq('id', themeId)
            .single();
        const insert = {
            theme_id: themeId,
            process_id: theme.process_id,
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
        if (error)
            throw new common_1.BadRequestException(error.message);
        return data;
    }
    async create(processId, dto, teacherId) {
        await this.assertProcessOwner(processId, teacherId);
        const insert = {
            process_id: processId,
            title: dto.title,
            description: dto.description,
            lesson_type: dto.lessonType,
            content_url: dto.contentUrl,
            order_index: dto.orderIndex,
        };
        if (dto.themeId !== undefined)
            insert.theme_id = dto.themeId;
        const { data, error } = await this.supabase.admin
            .from('lessons')
            .insert(insert)
            .select()
            .single();
        if (error)
            throw new common_1.BadRequestException(error.message);
        return data;
    }
    async update(id, dto, teacherId) {
        const { data: lesson } = await this.supabase.admin
            .from('lessons')
            .select('*, themes!inner(processes!inner(teacher_id, id))')
            .eq('id', id)
            .single();
        if (!lesson)
            throw new common_1.NotFoundException('Lesson not found');
        if (lesson.themes?.processes?.teacher_id !== teacherId) {
            throw new common_1.ForbiddenException('Not your lesson');
        }
        const update = {};
        if (dto.title !== undefined)
            update.title = dto.title;
        if (dto.description !== undefined)
            update.description = dto.description;
        if (dto.lessonType !== undefined)
            update.lesson_type = dto.lessonType;
        if (dto.contentUrl !== undefined)
            update.content_url = dto.contentUrl;
        if (dto.orderIndex !== undefined)
            update.order_index = dto.orderIndex;
        if (dto.themeId !== undefined)
            update.theme_id = dto.themeId;
        const { data } = await this.supabase.admin
            .from('lessons')
            .update(update)
            .eq('id', id)
            .select()
            .single();
        return data;
    }
    async remove(id, teacherId) {
        const { data: lesson } = await this.supabase.admin
            .from('lessons')
            .select('*, themes!inner(processes!inner(teacher_id, id))')
            .eq('id', id)
            .single();
        if (!lesson)
            throw new common_1.NotFoundException('Lesson not found');
        if (lesson.themes?.processes?.teacher_id !== teacherId) {
            throw new common_1.ForbiddenException('Not your lesson');
        }
        await this.supabase.admin.from('lessons').delete().eq('id', id);
    }
};
exports.LessonsService = LessonsService;
exports.LessonsService = LessonsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], LessonsService);
//# sourceMappingURL=lessons.service.js.map