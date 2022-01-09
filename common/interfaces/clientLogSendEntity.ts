export interface ClientLogSendEntity{
    id: number;
    angleOfSend: number;
    suggestedGrade?: number;
    didLike: boolean;
    userId: number
    username: string;
    problemId: number;
    isMirrored: boolean;
    dateOfLog: string;
    didFlash?: boolean;
}