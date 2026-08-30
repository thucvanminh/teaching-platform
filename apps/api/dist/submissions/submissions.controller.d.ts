import { CreateSubmissionDto, GradeSubmissionDto } from './dto/submission.dto';
import { SubmissionsService } from './submissions.service';
export declare class SubmissionsController {
    private service;
    constructor(service: SubmissionsService);
    create(dto: CreateSubmissionDto, req: any): Promise<any>;
    grade(id: string, dto: GradeSubmissionDto, req: any): Promise<{
        submission: any;
        totalScore: number;
        earnedScore: number;
        scorePercent: number;
    }>;
    review(id: string, req: any): Promise<{
        submission: any;
        answers: {
            id: any;
            questionId: any;
            questionContent: any;
            questionType: any;
            selectedOptionId: any;
            essayAnswer: any;
            isCorrect: any;
            correctAnswer: any;
            explanation: any;
            points: any;
            options: any;
        }[];
    }>;
    history(lessonId: string, req: any): Promise<{
        id: any;
        attemptNumber: any;
        score: any;
        maxScore: any;
        scorePercent: number;
        status: any;
        submittedAt: any;
    }[]>;
    teacherSubmissions(lessonId: string, req: any): Promise<{
        id: any;
        studentId: any;
        studentName: any;
        attemptNumber: any;
        status: any;
        score: any;
        maxScore: any;
        scorePercent: number;
        submittedAt: any;
    }[]>;
}
