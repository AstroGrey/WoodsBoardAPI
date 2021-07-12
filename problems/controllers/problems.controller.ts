import express from 'express';
import problemsService from '../services/problems.service';
import debug from 'debug';

const log: debug.IDebugger = debug('app:problems-controller');
export class ProblemsController {
    async listProblems(req: express.Request, res: express.Response) {
        console.log("problemsController listProblems func");
        const problem = await problemsService.list();
        res.status(200).send(problem);
    }
    async getProblemHoldList(req: express.Request, res: express.Response){
        console.log("problemsController getProblemHoldList func");
        const holdList = await problemsService.getProblemHoldList(req.params.id);
        res.status(201).send(holdList)
    }
    async createProblem(req: express.Request, res: express.Response) {
        console.log("problemsController createProblem func");
        const problem = await problemsService.create(req.body);
        // send problem id to client
        res.status(201).send({ problem });
    }

    async getProblemById(req: express.Request, res: express.Response) {
        console.log("controller get Problem by Id", req.params.id)
        const problem = await problemsService.searchById(req.params.id);
        res.status(201).send(problem);
    }

    /*async patch(req: express.Request, res: express.Response) {
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

    async removeProblemById(req: express.Request, res: express.Response) {
        log(await problemsService.deleteById(req.params.problemId));
        res.status(204).send();
    }*/
}

export default new ProblemsController();
