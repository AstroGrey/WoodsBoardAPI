import shortid from 'shortid';
import debug from 'debug';
import { CreateProblemDto } from '../dto/create.problem.dto';
import { PatchProblemDto } from '../dto/patch.problem.dto';
import { PutProblemDto } from '../dto/put.problems.dto';

const log: debug.IDebugger = debug('app:in-memory-dao');

class ProblemsDao {
    problems: Array<CreateProblemDto> = [];

    constructor() {
        log('Created new instance of ProblemsDao');
    }

    async addProblem(problem: CreateProblemDto) {
        problem.id = shortid.generate();
        this.problems.push(problem);
        return problem.id;
    }

    async getProblems() {
        return this.problems;
    }

    async getProblemById(problemId: string) {
        return this.problems.find((problem: { id: string }) => problem.id === problemId);
    }

    async putProblemById(problemId: string, problem: PutProblemDto) {
        const objIndex = this.problems.findIndex(
            (obj: { id: string }) => obj.id === problemId);
        this.problems.splice(objIndex, 1, problem);
        return `${problem.id} updated via put`;
    }

    async patchProblemById(problemId: string, problem: PatchProblemDto) {
        const objIndex = this.problems.findIndex(
            (obj: { id: string }) => obj.id === problemId);
        let currentProblem = this.problems[objIndex];
        const allowedPatchFields = [
            'rules',
        ];
        for (let field of allowedPatchFields) {
            if (field in problem) {
                // @ts-ignore
                currentProblem[field] = problem[field];
            }
        }
        this.problems.splice(objIndex, 1, currentProblem);
        return `${problem.id} patched`;
    }

    async removeProblemById(problemId: string) {
        const objIndex = this.problems.findIndex(
            (obj: { id: string }) => obj.id === problemId);
        this.problems.splice(objIndex, 1);
        return `${problemId} removed`;
    }

    async getProblemByName(name: string) {
        const objIndex = this.problems.findIndex(
            (obj: { problemName: string }) => obj.problemName === name);
        let currentProblem = this.problems[objIndex];
        if (currentProblem) {
            return currentProblem;
        } else {
            return null;
        }
    }
    async getProblemByAuthor(username: string) {
        const objIndex = this.problems.findIndex(
            (obj: { authorUsername: string }) => obj.authorUsername === username);
        let currentProblem = this.problems[objIndex];
        if (currentProblem) {
            return currentProblem;
        } else {
            return null;
        }
    }
}

export default new ProblemsDao();
