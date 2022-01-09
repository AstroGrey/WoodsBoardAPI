import { CommonRoutesConfig } from '../common/common.routes.config';
import ProblemsController from './controllers/problems.controller';
import ProblemsMiddleware from './middleware/problems.middleware';
import usersMiddleware from '../users/middleware/users.middleware';
import logSendsMiddleware from './middleware/logSends.middleware';
import express from 'express';

export class ProblemsRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'ProblemsRoutes');
    }

    configureRoutes() {
        this.app.param(`id`, ProblemsMiddleware.extractProblemId);
        this.app
            .route(`/problems/id/:id`)
            .all(ProblemsMiddleware.validateProblemExists)
            .get(ProblemsController.getProblemById)
            .delete(ProblemsController.removeProblemById)
            .patch(ProblemsController.patchById);
        // Get problems by angle
        this.app.param(`angle`, ProblemsMiddleware.extractProblemAngle);
        this.app
            .route(`/problems/angle/:angle`)
            .get(ProblemsController.listProblemsByAngle)
        this.app
            .route(`/problems`)
            .get(ProblemsController.listProblems)
            .post(
                ProblemsMiddleware.validateRequiredProblemBodyFields, // check if appropriate amount of fields
                ProblemsMiddleware.validateSameNameDoesntExist,
                //usersMiddleware.validateUsernameExists,
                ProblemsController.createProblem
            )
            //.delete(ProblemsController.deleteAllProblems);
        
        this.app.param(`id`, ProblemsMiddleware.extractProblemId);
        this.app
            .route(`/problems/log/:id`)
            .post(
                logSendsMiddleware.validateRequiredProblemBodyFields,
                ProblemsMiddleware.validateProblemExists,
                //logSendsMiddleware.validateNotDuplicateLog,
                ProblemsController.logSend
            )
    
        return this.app;
    }
}
