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
    async create(processId, dto, teacherId) {
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
        if (error)
            throw new Error(error.message);
        return {
            id: data.id,
            title: data.title,
            description: data.description,
            lessonType: data.lesson_type,
            contentUrl: data.content_url,
            orderIndex: data.order_index,
        };
    }
    async update(id, dto, teacherId) {
        const { data: lesson } = await this.supabase.admin
            .from('lessons')
            .select('*, processes(teacher_id)')
            .eq('id', id)
            .single();
        if (!lesson)
            throw new common_1.NotFoundException('Lesson not found');
        if (lesson.processes?.teacher_id !== teacherId) {
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
    async remove(id, teacherId) {
        const { data: lesson } = await this.supabase.admin
            .from('lessons')
            .select('*, processes(teacher_id)')
            .eq('id', id)
            .single();
        if (!lesson)
            throw new common_1.NotFoundException('Lesson not found');
        if (lesson.processes?.teacher_id !== teacherId) {
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