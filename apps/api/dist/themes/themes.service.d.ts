import { SupabaseService } from '../supabase/supabase.service';
import { CreateThemeDto, UpdateThemeDto } from './dto/theme.dto';
export declare class ThemesService {
    private supabase;
    constructor(supabase: SupabaseService);
    findAllForProcess(processId: string, userId: string, role: string): Promise<any[]>;
    findOne(id: string, userId: string, role: string): Promise<any>;
    create(processId: string, dto: CreateThemeDto, teacherId: string): Promise<any>;
    update(id: string, dto: UpdateThemeDto, teacherId: string): Promise<any>;
    remove(id: string, teacherId: string): Promise<void>;
    reorder(processId: string, themeIds: string[], teacherId: string): Promise<{
        message: string;
    }>;
}
