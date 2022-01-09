import { UserEntity } from './entities/userEntity';
import { EntityRepository, Repository, getConnection } from "typeorm";
import { ProblemEntity } from './entities/problemEntity';
import { ClientUserEntity } from '../common/interfaces/clientUserEntiy';
import { LogSendEntity } from './entities/logSendEntity';
import { ClientLogSendEntity } from '../common/interfaces/clientLogSendEntity';
import { UserRepository } from './userRepository';
import { problemRepository } from './problemsRepository';
import date from 'date-and-time';


@EntityRepository()
export class LogSendRepository extends Repository<LogSendEntity> {
    // logSendRepos = getConnection(process.env.RDS_DB_NAME).getRepository(LogSendEntity); 
    userRepos = new UserRepository();
    probRepos = new problemRepository();

    async translateToClientLogSendEntity(log: LogSendEntity): Promise<ClientLogSendEntity> {
        const clientEntity: ClientLogSendEntity = {
            id: log.id,
            angleOfSend: log.angleOfSend,
            suggestedGrade: log.suggestedGrade,
            didLike: log.didLike,
            userId: log.user.id,
            username: log.user.username,
            problemId: log.problem.id,
            isMirrored: log.isMirrored,
            dateOfLog: log.dateOfLog,
            didFlash: log.didFlash
        };
        return clientEntity;
    }

    async logSend(sendInfo: ClientLogSendEntity) {
        console.log("Log Send");
        let newLog = new LogSendEntity();

        if (await this.checkForExistingLog(sendInfo)) { // repeat log
            console.log("Log is repeat");
            await this.probRepos.updateProblemLogs(await this.logRepeat(sendInfo));
        }
        else {
            newLog.angleOfSend = sendInfo.angleOfSend;
            newLog.suggestedGrade = sendInfo.suggestedGrade;
            newLog.didLike = sendInfo.didLike;
            newLog.didFlash = sendInfo.didFlash;
            let user = await this.userRepos.searchById(sendInfo.userId);
            newLog.user = user;
            let problem = await this.probRepos.searchById(sendInfo.problemId);
            newLog.problem = problem;

            // Date
            let now = new Date();
            newLog.dateOfLog = date.format(now, 'MM/DD/YYYY');

            let savedLog = await getConnection("WoodsTestDB").manager.save(newLog);
            console.log(savedLog);

            // Update problem shit
            await this.probRepos.updateProblemLogs(savedLog);
        }
    }

    async checkForExistingLog(log: ClientLogSendEntity): Promise<Boolean> {
        let dbLog = await getConnection("WoodsTestDB").manager.findOne(LogSendEntity,{ 
            relations: ["problem", "user"],
            where: {
                problem: {
                    id: log.problemId
                },
                user: {
                    id: log.userId
                },
                isMirrored: log.isMirrored,
                angleOfSend: log.angleOfSend
            }
        });
        if (dbLog) {
            console.log("Log already exists");
            return true;
        }
        else {
            console.log("Log dont exists");
            return false;
        }
    }

    async logRepeat(sendInfo: ClientLogSendEntity){
        let repeat = new LogSendEntity();
        repeat.angleOfSend = sendInfo.angleOfSend;
        repeat.suggestedGrade = sendInfo.suggestedGrade;
        //repeat.user.id = sendInfo.userId;
        //repeat.problem.id = sendInfo.problemId;
        repeat.isRepeat = true;

        // Date
        let now = new Date();
        repeat.dateOfLog = date.format(now, 'MM/DD/YYYY');

        let savedRepeat = await getConnection("WoodsTestDB").manager.save(repeat);
        console.log(savedRepeat);

        return savedRepeat;
    }

    async getLogById(logId: number): Promise<LogSendEntity> {
        let dbLog = await getConnection("WoodsTestDB").manager.findOne(LogSendEntity, {
            where: { id: logId }
        });
        if (dbLog) {
            return dbLog;
        }
        else {
            return dbLog!;
        }
    }

    async getLogsForProblem(problemId: any): Promise<ClientLogSendEntity[]> {
        let [allLogs, amountOfLogs] = await getConnection("WoodsTestDB").manager.findAndCount(LogSendEntity, {
            where: { problemId: problemId }
        });
        if (allLogs != []) {
            let allLogsFinal: ClientLogSendEntity[];
            allLogsFinal = Array(amountOfLogs);
            for (var i = 0; i < amountOfLogs; i++) {
                allLogsFinal[i] = await this.translateToClientLogSendEntity(await this.getLogById(allLogs[i].id));
            }
            console.log("All problems from the db: ", allLogs);
            return allLogsFinal;
        }
        else {
            console.log("No problems found");
            return [];
        }
    }
}

export default new LogSendRepository();