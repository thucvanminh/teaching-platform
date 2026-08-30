import { SupabaseService } from '../supabase/supabase.service';
import { CreateQuestionDto, UpdateQuestionDto, CreateOptionDto, UpdateOptionDto } from './dto/question.dto';
export declare class QuestionsService {
    private supabase;
    constructor(supabase: SupabaseService);
    private assertLessonOwner;
    findAllForLesson(lessonId: string, userId: string, role: string): Promise<any[]>;
    findOne(id: string, userId: string, role: string): Promise<any>;
    create(lessonId: string, dto: CreateQuestionDto, teacherId: string): Promise<any>;
    update(id: string, dto: UpdateQuestionDto, teacherId: string): Promise<any>;
    remove(id: string, teacherId: string): Promise<void>;
    getOptions(questionId: string, userId: string, role: string): Promise<any[]>;
    createOption(questionId: string, dto: CreateOptionDto, teacherId: string): Promise<any>;
    updateOption(id: string, dto: UpdateOptionDto, teacherId: string): Promise<any>;
    removeOption(id: string, teacherId: string): Promise<void>;
    reorderOptions(questionId: string, optionIds: string[], teacherId: string): Promise<{
        message: string;
    }>;
}
