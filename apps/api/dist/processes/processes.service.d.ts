import { SupabaseService } from '../supabase/supabase.service';
import { CreateProcessDto, UpdateProcessDto } from './dto/process.dto';
export declare class ProcessesService {
    private supabase;
    constructor(supabase: SupabaseService);
    findAll(userId: string, role: string): Promise<{
        id: any;
        title: any;
        description: any;
        status: any;
        createdAt: any;
        lessonCount: number;
    }[]>;
    findOne(id: string, userId: string, role: string): Promise<{
        id: any;
        title: any;
        description: any;
        status: any;
        createdAt: any;
        lessons: {
            id: any;
            title: any;
            description: any;
            lessonType: any;
            contentUrl: any;
            orderIndex: any;
        }[];
    }>;
    create(dto: CreateProcessDto, teacherId: string): Promise<{
        id: any;
        title: any;
        description: any;
        status: any;
        createdAt: any;
        lessonCount: number;
    }>;
    update(id: string, dto: UpdateProcessDto, teacherId: string): Promise<{
        id: any;
        title: any;
        description: any;
        status: any;
        createdAt: any;
    }>;
    remove(id: string, teacherId: string): Promise<void>;
}
