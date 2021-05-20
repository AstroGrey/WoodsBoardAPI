import { hold } from  '../../common/holdClass';

export interface CreateProblemDto {
    id: string; // generated id 
    problemName: string; // problem name
    problemGrade: number; // problem grade (VX)
    authorUsername: string;
    rules?: string;
    holdList: Array<hold>; // array of holds for problem
}