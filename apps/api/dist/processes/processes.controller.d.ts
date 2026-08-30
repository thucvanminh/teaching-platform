import { CreateProcessDto, UpdateProcessDto } from './dto/process.dto';
import { ProcessesService } from './processes.service';
export declare class ProcessesController {
    private service;
    constructor(service: ProcessesService);
    findAll(req: any): Promise<{
        id: any;
        title: any;
        description: any;
        status: any;
        createdAt: any;
        lessonCount: number;
    }[]>;
    findOne(id: string, req: any): Promise<{
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
    create(dto: CreateProcessDto, req: any): Promise<{
        id: any;
        title: any;
        description: any;
        status: any;
        createdAt: any;
        lessonCount: number;
    }>;
    update(id: string, dto: UpdateProcessDto, req: any): Promise<{
        id: any;
        title: any;
        description: any;
        status: any;
        createdAt: any;
    }>;
    remove(id: string, req: any): Promise<void>;
}
