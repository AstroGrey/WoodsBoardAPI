import { CommonRoutesConfig } from '../common/common.routes.config';
import ProblemsController from './controllers/problems.controller';
import ProblemsMiddleware from './middleware/problems.middleware';
import express from 'express';

export class ProblemsRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'ProblemsRoutes');
    }

    configureRoutes() {
        this.app
            .route(`/problems`)
            .get(ProblemsController.listProblems)
            .post(
                ProblemsMiddleware.validateRequiredProblemBodyFields, // check if appropriate amount of fields
                ProblemsController.createProblem
            );

        this.app.param(`id`, ProblemsMiddleware.extractProblemId);
        this.app
            .route(`/problems/:id`)
            .all(ProblemsMiddleware.validateProblemExists)
            .get(ProblemsController.getProblemById)
            //.delete(ProblemsController.removeProblem);
        /*this.app.put(`/problems/:id`, [
            ProblemsMiddleware.validateRequiredProblemBodyFields,
            //ProblemsController.put,
        ]);

        this.app.patch(`/problems/:id`, [
           // ProblemsController.patch,
        ]);*/

        return this.app;
    }
}
