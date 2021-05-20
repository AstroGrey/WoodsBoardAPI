import { hold } from  '../../common/holdClass';

export interface PutProblemDto {
    id: string; // generated id 
    problemName: string; // problem name
    problemGrade: number; // problem grade (VX)
    authorUsername: string; // authour's username
    rules?: string; // string of any rules specified by the author
    holdList: Array<hold> // array of holds for problem
}
