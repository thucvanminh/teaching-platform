import { CreateThemeDto, UpdateThemeDto } from './dto/theme.dto';
import { CreateLessonDto, UpdateLessonDto } from '../lessons/dto/lesson.dto';
import { ThemesService } from './themes.service';
import { LessonsService } from '../lessons/lessons.service';
export declare class ThemesController {
    private themesService;
    private lessonsService;
    constructor(themesService: ThemesService, lessonsService: LessonsService);
    findAllThemes(processId: string, req: any): Promise<any[]>;
    findOneTheme(id: string, req: any): Promise<any>;
    createTheme(processId: string, dto: CreateThemeDto, req: any): Promise<any>;
    updateTheme(id: string, dto: UpdateThemeDto, req: any): Promise<any>;
    removeTheme(id: string, req: any): Promise<void>;
    reorderThemes(processId: string, themeIds: string[], req: any): Promise<{
        message: string;
    }>;
    findAllLessons(themeId: string, req: any): Promise<any[]>;
    findOneLesson(lessonId: string, req: any): Promise<any>;
    createLesson(processId: string, themeId: string, dto: CreateLessonDto, req: any): Promise<any>;
    updateLesson(lessonId: string, dto: UpdateLessonDto, req: any): Promise<any>;
    removeLesson(lessonId: string, req: any): Promise<void>;
}
