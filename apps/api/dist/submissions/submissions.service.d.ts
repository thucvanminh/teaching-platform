import { SupabaseService } from '../supabase/supabase.service';
export declare class SubmissionsService {
    private supabase;
    constructor(supabase: SupabaseService);
    createSubmission(dto: {
        lessonId: string;
    }, studentId: string): Promise<any>;
    gradeSubmission(submissionId: string, dto: {
        answers: {
            questionId: string;
            selectedOptionId?: string;
            essayAnswer?: string;
        }[];
    }, studentId: string): Promise<{
        submission: any;
        totalScore: number;
        earnedScore: number;
        scorePercent: number;
    }>;
    getSubmissionReview(submissionId: string, userId: string, role: string): Promise<{
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
    getSubmissionHistory(lessonId: string, studentId: string): Promise<{
        id: any;
        attemptNumber: any;
        score: any;
        maxScore: any;
        scorePercent: number;
        status: any;
        submittedAt: any;
    }[]>;
    getSubmissionsForTeacher(lessonId: string, teacherId: string): Promise<{
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
