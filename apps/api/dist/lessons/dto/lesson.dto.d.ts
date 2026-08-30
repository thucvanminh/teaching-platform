export declare class CreateLessonDto {
    title: string;
    description?: string;
    lessonType?: string;
    contentUrl?: string;
    orderIndex: number;
    themeId?: string;
}
export declare class UpdateLessonDto {
    title?: string;
    description?: string;
    lessonType?: string;
    contentUrl?: string;
    orderIndex?: number;
    themeId?: string;
}
