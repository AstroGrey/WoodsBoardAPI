import express from 'express';
import debug from 'debug';
import problemService from '../services/problems.service';
import { LogSendRepository } from '../../database/LogSendRepository';

const log: debug.IDebugger = debug('app:logsends-controller');
class LogSendsMiddleware {

    logSendRepos = new LogSendRepository();

    async validateRequiredProblemBodyFields( // checks to see if request has required fields
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        console.log("logSendsMiddleware");
        if (req.body){
            if(!req.body.angleOfSend){
                res.status(400).send({
                    error: `Invalid angle`,
                });
            }
            else if(!req.body.suggestedGrade){
                res.status(400).send({
                    error: `Invalid suggested grade`,
                });
            }
            else if(!req.body.didLike){
                res.status(400).send({
                    error: `Invalid like`,
                });
            }
            else if(!req.body.userId){
                res.status(400).send({
                    error: `Invalid user id`,
                });
            }
            else if(!req.body.problemId){
                res.status(400).send({
                    error: `Invalid problem id`,
                });
            }
            else if(!req.body.isMirrored){
                res.status(400).send({
                    error: `Invalid isMirrored`,
                });
            }
            else if(!req.body.userId){
                res.status(400).send({
                    error: `Invalid user id`,
                });
            }
            else if(!req.body.didFlash){
                res.status(400).send({
                    error: `Invalid didFlash`,
                }); 
            }
            console.log(req.body.id)
            next();
        } 
        else {
            res.status(400).send({
                error: `Log Send request missing body`,
            });
        }
    }

    /*async validateNotDuplicateLog(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ){
        console.log("Validating if Same Log exists");
        let log = await problemService.getLog(req.body);
        let clientLog = await this.logSendRepos.translateToClientLogSendEntity(log);
        if( clientLog.problemId == req.body.problemId &&
            clientLog.username == req.body.username &&
            clientLog.isMirrored == req.body.isMirrored &&
            clientLog.angleOfSend == req.body.angleOfSend){
                res.status(400).send({
                    error: `Log Has Already Been Made`,
                });
        }
        else{
            next();
        }
    }*/
}

export default new LogSendsMiddleware();