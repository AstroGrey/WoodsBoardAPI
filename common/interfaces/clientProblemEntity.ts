import { ClientHoldEntity } from "./clientHoldEntity";

export interface ClientProblemEntity{
    id: number;
    problemName: string;
    author: string;
    problemGrade: number;
    isBenchmark?: boolean;
    matching?: boolean;
    holdList: ClientHoldEntity[];
    angle: number;
    datePublished: string;
    holdCount: number;
    isProject?: boolean;
    proposedGrade?: number;
    totalLogLikes?: number;
    totalLogDislikes?: number;
    repeats?: number;
}