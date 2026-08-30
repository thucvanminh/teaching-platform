import { SupabaseService } from '../supabase/supabase.service';
import { CreateLessonDto, UpdateLessonDto } from './dto/lesson.dto';
export declare class LessonsService {
    private supabase;
    constructor(supabase: SupabaseService);
    private assertProcessOwner;
    private assertThemeOwner;
    findAllForTheme(themeId: string, userId: string, role: string): Promise<any[]>;
    findOne(id: string, userId: string, role: string): Promise<any>;
    createForTheme(themeId: string, dto: CreateLessonDto, teacherId: string): Promise<any>;
    create(processId: string, dto: CreateLessonDto, teacherId: string): Promise<any>;
    update(id: string, dto: UpdateLessonDto, teacherId: string): Promise<any>;
    remove(id: string, teacherId: string): Promise<void>;
}
