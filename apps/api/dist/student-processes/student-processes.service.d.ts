import { SupabaseService } from '../supabase/supabase.service';
import { AssignProcessDto } from './dto/assign-process.dto';
export declare class StudentProcessesService {
    private supabase;
    constructor(supabase: SupabaseService);
    findAllForUser(userId: string, role: string): Promise<{
        id: any;
        studentId: any;
        studentName: any;
        processId: any;
        processTitle: any;
        assignedAt: any;
    }[]>;
    getStudents(): Promise<{
        id: any;
        fullName: any;
    }[]>;
    assign(dto: AssignProcessDto, teacherId: string): Promise<{
        message: string;
    }>;
    unassign(id: string, teacherId: string): Promise<void>;
    unassignByPair(processId: string, studentId: string, teacherId: string): Promise<{
        message: string;
    }>;
}
