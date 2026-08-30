import { CreateLessonDto, UpdateLessonDto } from './dto/lesson.dto';
import { LessonsService } from './lessons.service';
export declare class LessonsController {
    private service;
    constructor(service: LessonsService);
    create(processId: string, dto: CreateLessonDto, req: any): Promise<{
        id: any;
        title: any;
        description: any;
        lessonType: any;
        contentUrl: any;
        orderIndex: any;
    }>;
    update(id: string, dto: UpdateLessonDto, req: any): Promise<{
        id: any;
        title: any;
        description: any;
        lessonType: any;
        contentUrl: any;
        orderIndex: any;
    }>;
    remove(id: string, req: any): Promise<void>;
}
