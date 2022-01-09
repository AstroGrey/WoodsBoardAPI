import express from 'express';
import problemsService from '../services/problems.service';
import debug from 'debug';

const log: debug.IDebugger = debug('app:problems-controller');
export class ProblemsController {
    async listProblems(req: express.Request, res: express.Response) {
        console.log("problemsController listProblems func");
        const problems = await problemsService.list();
        res.status(200).send(problems);
    }
    async createProblem(req: express.Request, res: express.Response) {
        console.log("problemsController createProblem func", req.body);
        const problem = await problemsService.create(req.body);
        res.status(201).send({ problem });
    }
    async getProblemById(req: express.Request, res: express.Response) {
        console.log("controller get Problem by Id", req.params.id)
        const problem = await problemsService.searchById(req.params.id);
        res.status(201).send({ problem });
    }
    async deleteAllProblems(req: express.Request, res: express.Response){
        console.log("controller deleteAllProblems")
        await problemsService.deleteProblems();
        res.status(204).send("All problems deleted");
    }
    async patchById(req: express.Request, res: express.Response) {
        console.log(req.body);
        const problem = await problemsService.patchById(req.body.id, req.body);
        res.status(201).send({ problem });
    }
    async removeProblemById(req: express.Request, res: express.Response) {
        console.log("controller removeProblemById", req.params.id);
        await problemsService.deleteById(req.params.id);
        res.status(204).send("Problem deleted");
    }
    async logSend(req: express.Request, res: express.Response){
        console.log("controller logSend");
        await problemsService.logSend(req.body);
        res.status(204).send("Log recorded");
    }
    async listProblemsByAngleAndGrade(req: express.Request, res: express.Response) {
        console.log("controller rlistProblemsByAngleAndGrade", req.params.angle, req.params.grade);
        const problem = await problemsService.listByAngleAndGrade(req.params.angle, req.params.grade);
        res.status(204).send(problem);
    }
    async listProblemsByAngle(req: express.Request, res: express.Response) {
        console.log("problemsController listProblemsByAngle func");
        const problems = await problemsService.listByAngle(req.params.angle);
        res.status(200).send(problems);
    }
}

export default new ProblemsController();
