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
exports.ProcessesService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../supabase/supabase.service");
let ProcessesService = class ProcessesService {
    constructor(supabase) {
        this.supabase = supabase;
    }
    async findAll(userId, role) {
        if (role === 'teacher') {
            const { data: processes } = await this.supabase.admin
                .from('processes')
                .select('*')
                .eq('teacher_id', userId)
                .order('created_at', { ascending: false });
            if (!processes)
                return [];
            const results = await Promise.all(processes.map(async (p) => {
                const { count } = await this.supabase.admin
                    .from('lessons')
                    .select('*', { count: 'exact', head: true })
                    .eq('process_id', p.id);
                return {
                    id: p.id,
                    title: p.title,
                    description: p.description,
                    status: p.status,
                    createdAt: p.created_at,
                    lessonCount: count || 0,
                };
            }));
            return results;
        }
        const { data: assignments } = await this.supabase.admin
            .from('student_processes')
            .select('process_id')
            .eq('student_id', userId);
        if (!assignments || assignments.length === 0)
            return [];
        const processIds = assignments.map((a) => a.process_id);
        const { data: processes } = await this.supabase.admin
            .from('processes')
            .select('*')
            .in('id', processIds);
        if (!processes)
            return [];
        return Promise.all(processes.map(async (p) => {
            const { count } = await this.supabase.admin
                .from('lessons')
                .select('*', { count: 'exact', head: true })
                .eq('process_id', p.id);
            return {
                id: p.id,
                title: p.title,
                description: p.description,
                status: p.status,
                createdAt: p.created_at,
                lessonCount: count || 0,
            };
        }));
    }
    async findOne(id, userId, role) {
        const { data: process } = await this.supabase.admin
            .from('processes')
            .select('*')
            .eq('id', id)
            .single();
        if (!process)
            throw new common_1.NotFoundException('Process not found');
        if (role === 'teacher') {
            if (process.teacher_id !== userId)
                throw new common_1.ForbiddenException('Not your process');
        }
        else {
            const { data: assigned } = await this.supabase.admin
                .from('student_processes')
                .select('id')
                .eq('student_id', userId)
                .eq('process_id', id)
                .single();
            if (!assigned)
                throw new common_1.ForbiddenException('Process not assigned to you');
        }
        const { data: lessons } = await this.supabase.admin
            .from('lessons')
            .select('*')
            .eq('process_id', id)
            .order('order_index', { ascending: true });
        return {
            id: process.id,
            title: process.title,
            description: process.description,
            status: process.status,
            createdAt: process.created_at,
            lessons: (lessons || []).map((l) => ({
                id: l.id,
                title: l.title,
                description: l.description,
                lessonType: l.lesson_type,
                contentUrl: l.content_url,
                orderIndex: l.order_index,
            })),
        };
    }
    async create(dto, teacherId) {
        const { data, error } = await this.supabase.admin
            .from('processes')
            .insert({ teacher_id: teacherId, title: dto.title, description: dto.description, status: 'active' })
            .select()
            .single();
        if (error)
            throw new common_1.BadRequestException(error.message);
        return {
            id: data.id,
            title: data.title,
            description: data.description,
            status: data.status,
            createdAt: data.created_at,
            lessonCount: 0,
        };
    }
    async update(id, dto, teacherId) {
        const { data: process } = await this.supabase.admin
            .from('processes')
            .select('*')
            .eq('id', id)
            .single();
        if (!process)
            throw new common_1.NotFoundException('Process not found');
        if (process.teacher_id !== teacherId)
            throw new common_1.ForbiddenException('Not your process');
        const update = {};
        if (dto.title !== undefined)
            update.title = dto.title;
        if (dto.description !== undefined)
            update.description = dto.description;
        if (dto.status !== undefined)
            update.status = dto.status;
        update.updated_at = new Date().toISOString();
        const { data } = await this.supabase.admin
            .from('processes')
            .update(update)
            .eq('id', id)
            .select()
            .single();
        return {
            id: data.id,
            title: data.title,
            description: data.description,
            status: data.status,
            createdAt: data.created_at,
        };
    }
    async remove(id, teacherId) {
        const { data: process } = await this.supabase.admin
            .from('processes')
            .select('*')
            .eq('id', id)
            .single();
        if (!process)
            throw new common_1.NotFoundException('Process not found');
        if (process.teacher_id !== teacherId)
            throw new common_1.ForbiddenException('Not your process');
        await this.supabase.admin.from('lessons').delete().eq('process_id', id);
        await this.supabase.admin.from('student_processes').delete().eq('process_id', id);
        await this.supabase.admin.from('processes').delete().eq('id', id);
    }
};
exports.ProcessesService = ProcessesService;
exports.ProcessesService = ProcessesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], ProcessesService);
//# sourceMappingURL=processes.service.js.map