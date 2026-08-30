import { CreateQuestionDto, UpdateQuestionDto, CreateOptionDto, UpdateOptionDto } from './dto/question.dto';
import { QuestionsService } from './questions.service';
export declare class QuestionsController {
    private service;
    constructor(service: QuestionsService);
    findAll(lessonId: string, req: any): Promise<any[]>;
    findOne(id: string, req: any): Promise<any>;
    create(lessonId: string, dto: CreateQuestionDto, req: any): Promise<any>;
    update(id: string, dto: UpdateQuestionDto, req: any): Promise<any>;
    remove(id: string, req: any): Promise<void>;
    getOptions(questionId: string, req: any): Promise<any[]>;
    createOption(questionId: string, dto: CreateOptionDto, req: any): Promise<any>;
    updateOption(id: string, dto: UpdateOptionDto, req: any): Promise<any>;
    removeOption(id: string, req: any): Promise<void>;
    reorderOptions(questionId: string, optionIds: string[], req: any): Promise<{
        message: string;
    }>;
}
