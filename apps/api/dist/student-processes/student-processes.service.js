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
exports.StudentProcessesService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../supabase/supabase.service");
let StudentProcessesService = class StudentProcessesService {
    constructor(supabase) {
        this.supabase = supabase;
    }
    async findAllForUser(userId, role) {
        if (role === 'teacher') {
            const { data: assignments } = await this.supabase.admin
                .from('student_processes')
                .select('*, processes!inner(teacher_id, title), user_profiles!student_processes_student_id_fkey(full_name)')
                .eq('processes.teacher_id', userId);
            if (!assignments)
                return [];
            return assignments.map((sp) => ({
                id: sp.id,
                studentId: sp.student_id,
                studentName: sp.user_profiles?.full_name || '',
                processId: sp.process_id,
                processTitle: sp.processes?.title || '',
                assignedAt: sp.assigned_at,
            }));
        }
        const { data: assignments } = await this.supabase.admin
            .from('student_processes')
            .select('*, processes(title)')
            .eq('student_id', userId);
        if (!assignments)
            return [];
        return assignments.map((sp) => ({
            id: sp.id,
            studentId: sp.student_id,
            studentName: '',
            processId: sp.process_id,
            processTitle: sp.processes?.title || '',
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
    async assign(dto, teacherId) {
        const { data: process } = await this.supabase.admin
            .from('processes')
            .select('teacher_id')
            .eq('id', dto.processId)
            .single();
        if (!process)
            throw new common_1.NotFoundException('Process not found');
        if (process.teacher_id !== teacherId) {
            throw new common_1.ForbiddenException('Not your process');
        }
        const { data: existing } = await this.supabase.admin
            .from('student_processes')
            .select('id')
            .eq('student_id', dto.studentId)
            .eq('process_id', dto.processId)
            .single();
        if (existing)
            throw new common_1.ConflictException('Already assigned');
        const { error } = await this.supabase.admin
            .from('student_processes')
            .insert({ student_id: dto.studentId, process_id: dto.processId });
        if (error)
            throw new Error(error.message);
        return { message: 'Assigned successfully' };
    }
    async unassign(id, teacherId) {
        const { data: sp } = await this.supabase.admin
            .from('student_processes')
            .select('*, processes(teacher_id)')
            .eq('id', id)
            .single();
        if (!sp)
            throw new common_1.NotFoundException('Assignment not found');
        if (sp.processes?.teacher_id !== teacherId) {
            throw new common_1.ForbiddenException('Not your process');
        }
        await this.supabase.admin.from('student_processes').delete().eq('id', id);
    }
};
exports.StudentProcessesService = StudentProcessesService;
exports.StudentProcessesService = StudentProcessesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], StudentProcessesService);
//# sourceMappingURL=student-processes.service.js.map