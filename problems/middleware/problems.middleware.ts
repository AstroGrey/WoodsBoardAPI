import express from 'express';
import problemService from '../services/problems.service';
import debug from 'debug';

const log: debug.IDebugger = debug('app:problems-controller');
class ProblemsMiddleware {
    async validateRequiredProblemBodyFields( // checks to see if request has required fields
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (req.body && req.body.problemName && req.body.problemGrade && req.body.username && req.body.authorFirstName && req.body.authorLastName && req.body.holdList) {  
            next();
        } else {
            res.status(400).send({
                error: `Invalid fields. Please try again idiot`,
            });
        }
    }

    async validateSameNameDoesntExist( // checks to see if problem name exists already 
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const problem = await problemService.getByName(req.body.problemName); // checks to see if user exists
        if (problem) {
            res.status(400).send({ error: `Problem name already exists` }); // user exists, cannot create user
        } else {
            next(); // user doesnt exist, can move on to create
        }
    }

    async validateProblemExists( // response to '/users/:userId' request
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const problem = await problemService.readById(req.params.problemId); // searches for user id
        if (problem) { 
            next();
        } else { 
            res.status(404).send({
                error: `Problem ${req.params.problemId} not found`, 
            });
        }
    }

    async extractProblemId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.id = req.params.problemId;
        next();
    }
}

export default new ProblemsMiddleware();
