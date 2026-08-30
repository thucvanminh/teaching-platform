import { AssignProcessDto } from './dto/assign-process.dto';
import { StudentProcessesService } from './student-processes.service';
export declare class StudentProcessesController {
    private service;
    constructor(service: StudentProcessesService);
    findAll(req: any): Promise<{
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
    assign(dto: AssignProcessDto, req: any): Promise<{
        message: string;
    }>;
    unassign(id: string, req: any): Promise<void>;
}
