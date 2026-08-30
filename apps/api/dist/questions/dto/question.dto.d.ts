export declare class CreateQuestionDto {
    content: string;
    questionType: string;
    correctAnswer?: string;
    explanation?: string;
    orderIndex?: number;
    points?: number;
}
export declare class UpdateQuestionDto {
    content?: string;
    questionType?: string;
    correctAnswer?: string;
    explanation?: string;
    orderIndex?: number;
    points?: number;
}
export declare class CreateOptionDto {
    content: string;
    orderIndex?: number;
    isCorrect?: boolean;
}
export declare class UpdateOptionDto {
    content?: string;
    orderIndex?: number;
    isCorrect?: boolean;
}
