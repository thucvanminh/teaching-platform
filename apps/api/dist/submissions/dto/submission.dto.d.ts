export declare class CreateSubmissionDto {
    lessonId: string;
}
export declare class AnswerDto {
    questionId: string;
    selectedOptionId?: string;
    essayAnswer?: string;
}
export declare class GradeSubmissionDto {
    answers: AnswerDto[];
}
