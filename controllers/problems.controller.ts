import express from 'express';
import problemsService from '../services/problems.service';
import debug from 'debug';

const log: debug.IDebugger = debug('app:problems-controller');
class ProblemsController {
    async listProblems(req: express.Request, res: express.Response) {
        const problem = await problemsService.list(100, 0);
        res.status(200).send(problem);
    }

    async getProblemById(req: express.Request, res: express.Response) {
        const problem = await problemsService.readById(req.params.id);
        res.status(200).send(problem);
    }

    async createProblem(req: express.Request, res: express.Response) {
        const problemId = await problemsService.create(req.body);
        res.status(201).send({ id: problemId });
    }

    async patch(req: express.Request, res: express.Response) {
        log(await problemsService.patchById(req.body.id, req.body));
        res.status(204).send();
    }

    async put(req: express.Request, res: express.Response) {
        log(
            await problemsService.putById(req.params.problemId, {
                id: req.params.problemId,
                ...req.body,
            })
        );
        res.status(204).send();
    }

    async removeProblem(req: express.Request, res: express.Response) {
        log(await problemsService.deleteById(req.params.problemId));
        res.status(204).send();
    }
}

export default new ProblemsController();
