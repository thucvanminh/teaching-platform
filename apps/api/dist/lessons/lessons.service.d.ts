import { SupabaseService } from '../supabase/supabase.service';
import { CreateLessonDto, UpdateLessonDto } from './dto/lesson.dto';
export declare class LessonsService {
    private supabase;
    constructor(supabase: SupabaseService);
    private assertProcessOwner;
    create(processId: string, dto: CreateLessonDto, teacherId: string): Promise<{
        id: any;
        title: any;
        description: any;
        lessonType: any;
        contentUrl: any;
        orderIndex: any;
    }>;
    update(id: string, dto: UpdateLessonDto, teacherId: string): Promise<{
        id: any;
        title: any;
        description: any;
        lessonType: any;
        contentUrl: any;
        orderIndex: any;
    }>;
    remove(id: string, teacherId: string): Promise<void>;
}
