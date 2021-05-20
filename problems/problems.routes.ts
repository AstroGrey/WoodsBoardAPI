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

        this.app.param(`problemId`, ProblemsMiddleware.extractProblemId);
        this.app
            .route(`/problems/:problemId`)
            .all(ProblemsMiddleware.validateProblemExists)
            .get(ProblemsController.getProblemById)
            .delete(ProblemsController.removeProblem);

        this.app.put(`/problems/:problemId`, [
            ProblemsMiddleware.validateRequiredProblemBodyFields,
            ProblemsController.put,
        ]);

        this.app.patch(`/problems/:problemId`, [
            ProblemsController.patch,
        ]);

        return this.app;
    }
}
