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
exports.ThemesService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../supabase/supabase.service");
let ThemesService = class ThemesService {
    constructor(supabase) {
        this.supabase = supabase;
    }
    async findAllForProcess(processId, userId, role) {
        if (role === 'teacher') {
            const { data: process } = await this.supabase.admin
                .from('processes')
                .select('teacher_id')
                .eq('id', processId)
                .single();
            if (!process)
                throw new common_1.NotFoundException('Process not found');
            if (process.teacher_id !== userId)
                throw new common_1.ForbiddenException('Not your process');
        }
        else {
            const { data: assigned } = await this.supabase.admin
                .from('student_processes')
                .select('id')
                .eq('student_id', userId)
                .eq('process_id', processId)
                .single();
            if (!assigned)
                throw new common_1.ForbiddenException('Process not assigned to you');
        }
        const { data, error } = await this.supabase.admin
            .from('themes')
            .select('*')
            .eq('process_id', processId)
            .order('order_index', { ascending: true });
        if (error)
            throw new common_1.BadRequestException(error.message);
        return data || [];
    }
    async findOne(id, userId, role) {
        const { data: theme } = await this.supabase.admin
            .from('themes')
            .select('*, processes(teacher_id)')
            .eq('id', id)
            .single();
        if (!theme)
            throw new common_1.NotFoundException('Theme not found');
        if (role === 'teacher') {
            if (theme.processes?.teacher_id !== userId) {
                throw new common_1.ForbiddenException('Not your theme');
            }
        }
        else {
            const { data: assigned } = await this.supabase.admin
                .from('student_processes')
                .select('id')
                .eq('student_id', userId)
                .eq('process_id', theme.process_id)
                .single();
            if (!assigned)
                throw new common_1.ForbiddenException('Theme not accessible');
        }
        return theme;
    }
    async create(processId, dto, teacherId) {
        const { data: process } = await this.supabase.admin
            .from('processes')
            .select('teacher_id')
            .eq('id', processId)
            .single();
        if (!process)
            throw new common_1.NotFoundException('Process not found');
        if (process.teacher_id !== teacherId)
            throw new common_1.ForbiddenException('Not your process');
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
        if (error)
            throw new common_1.BadRequestException(error.message);
        return data;
    }
    async update(id, dto, teacherId) {
        const { data: theme } = await this.supabase.admin
            .from('themes')
            .select('*, processes(teacher_id)')
            .eq('id', id)
            .single();
        if (!theme)
            throw new common_1.NotFoundException('Theme not found');
        if (theme.processes?.teacher_id !== teacherId) {
            throw new common_1.ForbiddenException('Not your theme');
        }
        const update = {};
        if (dto.title !== undefined)
            update.title = dto.title;
        if (dto.description !== undefined)
            update.description = dto.description;
        if (dto.orderIndex !== undefined)
            update.order_index = dto.orderIndex;
        const { data } = await this.supabase.admin
            .from('themes')
            .update(update)
            .eq('id', id)
            .select()
            .single();
        return data;
    }
    async remove(id, teacherId) {
        const { data: theme } = await this.supabase.admin
            .from('themes')
            .select('*, processes(teacher_id)')
            .eq('id', id)
            .single();
        if (!theme)
            throw new common_1.NotFoundException('Theme not found');
        if (theme.processes?.teacher_id !== teacherId) {
            throw new common_1.ForbiddenException('Not your theme');
        }
        await this.supabase.admin.from('themes').delete().eq('id', id);
    }
    async reorder(processId, themeIds, teacherId) {
        const { data: process } = await this.supabase.admin
            .from('processes')
            .select('teacher_id')
            .eq('id', processId)
            .single();
        if (!process)
            throw new common_1.NotFoundException('Process not found');
        if (process.teacher_id !== teacherId)
            throw new common_1.ForbiddenException('Not your process');
        const updates = themeIds.map((id, index) => this.supabase.admin.from('themes').update({ order_index: index }).eq('id', id));
        await Promise.all(updates);
        return { message: 'Reordered successfully' };
    }
};
exports.ThemesService = ThemesService;
exports.ThemesService = ThemesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], ThemesService);
//# sourceMappingURL=themes.service.js.map