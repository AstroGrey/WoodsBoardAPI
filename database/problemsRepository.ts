import { ProblemEntity } from './entities/problemEntity';
import { HoldEntity } from './entities/holdEntity';
import { EntityRepository, Repository, getConnection, createQueryBuilder } from "typeorm";
import holdRepos from './holdRepository';
import { UserEntity } from './entities/userEntity';
import { UserRepository } from './userRepository';
import baseHoldRepos from './baseHoldRepository';
import { BaseHoldEntity } from './entities/baseHoldEntity';
import { ClientProblemEntity } from '../common/interfaces/clientProblemEntity';
import date from 'date-and-time';
import { ClientUserEntity } from '../common/interfaces/clientUserEntiy';
import { ClientHoldEntity } from '../common/interfaces/clientHoldEntity';
import { LogSendEntity } from './entities/logSendEntity';
import holdRepository from './holdRepository';

@EntityRepository()
export class problemRepository extends Repository<ProblemEntity> {

    // Replace "getConnection("WoodsTestDB").manager" with "this.problemRepos" before uploading to official server
    // problemRepos = getConnection(process.env.RDS_DB_NAME).getRepository(ProblemEntity);
    userRepos = new UserRepository();

    
    async translateToClientEntity(problem: ProblemEntity): Promise <ClientProblemEntity>{ 
        console.log("translate Problem to client problem", problem);
        console.log("problem author", problem.authorEntity);
        const clientEntity: ClientProblemEntity = {
            id: problem.id,
            problemName: problem.problemName,
            problemGrade: problem.problemGrade,
            author: problem.authorEntity.username,
            isBenchmark: problem.isBenchmark,
            matching: problem.matching,
            angle: problem.angle,
            isProject: problem.isProject,
            //holdList: await holdRepos.translateToClientHoldList(problem),
            holdList: [],
            datePublished: problem.datePublished,
            holdCount: problem.holdCount,
            totalLogLikes: problem.totalLogLikes,
            totalLogDislikes: problem.totalLogDislikes,
            proposedGrade: problem.proposedGrade,
            repeats: problem.repeats
        };
        return clientEntity;
    }

    async createProblem(problem: ClientProblemEntity): Promise <ProblemEntity>{
        console.log("Create Problem");
        
        // Save Problem Attributes
        let newProblem = new ProblemEntity();
        newProblem.isProject = problem.isProject;
        newProblem.problemGrade = problem.problemGrade;
        newProblem.problemName = problem.problemName;
        newProblem.angle = problem.angle;
        newProblem.isBenchmark = problem.isBenchmark;
        newProblem.holdCount = problem.holdList.length;
        newProblem.matching = problem.matching;

        // Save Date Published
        let now = new Date();
        newProblem.datePublished = date.format(now, 'MM/DD/YYYY HH:mm:ss');

        // Assign User to problem relationship
        console.log("Problem author is", problem.author);
        let tempUser = new UserEntity();
        tempUser = await this.userRepos.searchByUsername(problem.author);
        newProblem.authorEntity = tempUser;

        // Save Holds in Problem
        newProblem.holdList = new Array(problem.holdList.length);
        for(var i = 0; i < problem.holdList.length; i++){ 
            // Create new instance of Hold Entity

            newProblem.holdList[i] = new HoldEntity(); 
            newProblem.holdList[i].type = problem.holdList[i].type;

            // Save corresponding base hold to problem hold entity
            let tempBaseHold = new BaseHoldEntity();
            tempBaseHold = await baseHoldRepos.getBaseHoldByLocation(problem.holdList[i].baseHoldLocation); 
            newProblem.holdList[i].baseHoldId = tempBaseHold.id;
        }

        // Save Problem
        console.log("Problem saved");
        let savedProblem = await getConnection("WoodsTestDB").manager.save(newProblem);
        console.log(savedProblem);

        // Save Hold
        for(var i = 0; i < newProblem.holdCount; i++){
            // Create and Save new Hold
            holdRepos.createHold(problem.holdList[i].baseHoldLocation, newProblem.holdList[i].type, savedProblem.id);
        }

        return savedProblem;
    }

    async getAllProblems(): Promise <ClientProblemEntity[]> {
        // Returns all climbs in savedProblems, total of climbs in totalProblems
        let [savedProblems, totalProblems] = await getConnection("WoodsTestDB").manager.findAndCount(ProblemEntity,{
            relations: ["authorEntity"]
        });
        if(savedProblems != []){
            let savedProblemsFinal: ClientProblemEntity[];
            savedProblemsFinal = Array(totalProblems);
            for(var i = 0; i < totalProblems; i++){
                console.log("Problem: ", i, " of ", totalProblems, savedProblems[i]);
                savedProblemsFinal[i] = await this.translateToClientEntity(await this.searchById(savedProblems[i].id));
            }
            console.log("All problems from the db: ", savedProblems);
            return savedProblemsFinal;
        }
        else{
            console.log("No problems found");
            return []; 
        }
    }

    async getProblemsByAngle(angle: number): Promise <ClientProblemEntity[]> {
        let probRepos = getConnection(process.env.RDS_DB_NAME).getRepository(ProblemEntity);
        let [savedProblemsAtAngle, totalProblemsAtAngle] = await probRepos.findAndCount({
            relations: ["authorEntity"],
            where: {angle : angle}
        });
        if(savedProblemsAtAngle != []){
            let savedProblemsAtAngleFinal: ClientProblemEntity[];
            savedProblemsAtAngleFinal = Array(totalProblemsAtAngle);
            for(var i =0; i < totalProblemsAtAngle; i++){
                savedProblemsAtAngleFinal[i] = await this.translateToClientEntity(await this.searchById(savedProblemsAtAngle[i].id));
            }
            console.log("All problems from the db at angle: ", angle);
            console.log(savedProblemsAtAngle);
            return savedProblemsAtAngleFinal;
        }
        else{
            console.log("No problems at angle: ", angle, " found");
            return []; 
        }
    }

    async convertClimbsAroundAngle(angle: any): Promise <ClientProblemEntity[]>{
        var actualAngle: number = +angle;
        let climbs10AboveAngle = await this.getProblemsByAngle(actualAngle-10);
        let climbs5AboveAngle = await this.getProblemsByAngle(actualAngle-5);
        let climbsAtAngle = await this.getProblemsByAngle(actualAngle);
        let climbs5BelowAngle = await this.getProblemsByAngle(actualAngle+5);
        let climbs10BelowAngle = await this.getProblemsByAngle(actualAngle+10);
        var totalClimbs = (climbs10AboveAngle.length 
                        + climbs5AboveAngle.length 
                        + climbsAtAngle.length
                        + climbs5BelowAngle.length
                        + climbs10BelowAngle.length);
        let allClimbs = Array <ClientProblemEntity>(totalClimbs);
        var index = 0;
        for(var i = 0; i < climbs10AboveAngle.length; i++){
            allClimbs[index] = climbs10AboveAngle[i];
            allClimbs[index].proposedGrade = climbs10AboveAngle[i].problemGrade+2;
            index++;
        }
        for(var i = 0; i < climbs5AboveAngle.length; i++){
            allClimbs[index] = climbs5AboveAngle[i];
            allClimbs[index].proposedGrade = climbs5AboveAngle[i].problemGrade+1;
            index++;
        }
        for(var i = 0; i < climbsAtAngle.length; i++){
            allClimbs[index] = climbsAtAngle[i];
            allClimbs[index].proposedGrade = climbsAtAngle[i].problemGrade;
            index++;
        }
        for(var i = 0; i < climbs5BelowAngle.length; i++){
            allClimbs[index] = climbs5BelowAngle[i];
            if(climbs5BelowAngle[i].problemGrade-1 < 0){
                allClimbs[index].proposedGrade = 0;
            }
            else{
                allClimbs[index].proposedGrade = climbs5BelowAngle[i].problemGrade-1;
            }
            index++;
        }
        for(var i = 0; i < climbs10BelowAngle.length; i++){
            allClimbs[index] = climbs10BelowAngle[i];
            if(climbs10BelowAngle[i].problemGrade-2 < 0){
                allClimbs[index].proposedGrade = 0;
            }
            else{
                allClimbs[index].proposedGrade = climbs10BelowAngle[i].problemGrade-2;
            }
            index++;
        }
        return allClimbs;
    }

    async getProblemsByGradeAndAngle(angle: any, grade: any): Promise <ClientProblemEntity[]>{
        var actualGrade: number = +grade;

        let climbsByAngle = await this.convertClimbsAroundAngle(angle);
        let climbsByBoth = new Array();
        for(var i = 0; i < climbsByAngle.length; i++){
            if(climbsByAngle[i].proposedGrade == actualGrade || climbsByAngle[i].problemGrade == actualGrade){
                climbsByBoth.push(climbsByAngle[i]);
            }
        }

        return climbsByBoth;
    }

    async getProblemHoldList(problemID: any, holdCount: number): Promise <ClientHoldEntity[]>{
        console.log("probRepos getProblemHoldList of problem: ", problemID);
        let problemHoldList = await holdRepos.getHoldsByProblemId(problemID, holdCount);
        return await holdRepos.translateToClientHoldList(problemHoldList);
    }
   
    async searchById(id: any): Promise <ProblemEntity>{
        console.log("probRepos searchById");
        var actualId: number = +id;
        console.log(actualId);

        let problem = await  getConnection("WoodsTestDB").manager.findOne(ProblemEntity,{
            relations: ["authorEntity"],
            where: {id : actualId}
        });
        if(problem){
            console.log("Found problem", problem);
            
            // code to attach holds to problem entity
            /*let problemHoldList = await this.getProblemHoldList(id, problem.holdCount);
            problem.holdList = Array(problem.holdCount);
            for(var i = 0; i < problem.holdCount; i++){
                problem.holdList[i] = new ClientHoldEntity();
                problem.holdList[i].type = problemHoldList[i].type;
                problem.holdList[i].baseHoldlocation = problemHoldList[i].baseHoldId;
            }*/

            console.log("Returning Problem", problem);
            return problem;
        }
        else{
            console.log("No problem");
            return problem!;
       }
    }

    async searchByUsername(username: string): Promise <ClientProblemEntity>{
        let problem = await getConnection("WoodsTestDB").manager.findOne(ProblemEntity,{
            relations: ["authorEntity"],
            where: {username : username}
        });
        let finalProblem: ClientProblemEntity;
        if(problem){
            finalProblem = await this.translateToClientEntity(problem);
            return finalProblem;
        }
        else{
            return finalProblem!;
       }
    }

    async searchByName(problemName: string): Promise <ClientProblemEntity>{
        console.log("probRepos searchByName");
        console.log(problemName);
        let finalProblem: ClientProblemEntity;
        let problem = await  getConnection("WoodsTestDB").manager.findOne(ProblemEntity,{
            where: {problemName : problemName}
        });
        if(problem){
            console.log("Found problem");
            finalProblem = await this.translateToClientEntity(problem);
            return finalProblem;
        }
        else{
            console.log("No problem");
            return finalProblem!;
       }
    }

    async deleteAllProblems(){
        console.log("deleteAllProblems");
        let [savedProblems, totalProblems] = await  getConnection("WoodsTestDB").manager.findAndCount(ProblemEntity);
        for(var i = 0; i < totalProblems; i++){
            holdRepos.deleteHoldsByProblemId(savedProblems[i].id, savedProblems[i].holdCount);
        }
        await  getConnection("WoodsTestDB").manager.remove(
            savedProblems
        );
    }

    async removeById(id: any){
        console.log("Remove problem of id:", id);
        let problemToRemove = await this.searchById(id);
        await holdRepos.deleteHoldsByProblemId(id, problemToRemove.holdCount);
        await  getConnection("WoodsTestDB").manager.delete(ProblemEntity,{
            id : id
        });
    }

    async updateProblemLogs(logInfo: LogSendEntity){
        if(logInfo.isRepeat == true){ // log is repeat
            await getConnection("WoodsTestDB").manager.increment(ProblemEntity, logInfo.problem.id, "repeats", 1);
        }
        else{
            if(logInfo.didLike == false){ // log is new 
                await getConnection("WoodsTestDB").manager.increment(ProblemEntity, logInfo.problem.id, "totalLogDislikes", 1);
            }
            else if(logInfo.didLike == true){
                await getConnection("WoodsTestDB").manager.increment(ProblemEntity, logInfo.problem.id, "totalLogLikes", 1);
            }
        }
    }

    // REWRITE NOW THAT WE USE CLIENT ENTITY AND CAN CHECK VALUES OF EACH ATTRIBUTE
    async patchProblemById(id: any, problemInfo: Readonly<ClientProblemEntity>): Promise <ClientProblemEntity>{
        console.log("Patch problem:", problemInfo);
        let oldProblem = await this.searchById(id);
        let probAuthor = await this.userRepos.searchById(id); 

        // Patch Problem Attributes
        if(oldProblem.isBenchmark != problemInfo.isBenchmark)
            await getConnection("WoodsTestDB").manager.update( ProblemEntity, id, { isBenchmark: problemInfo.isBenchmark });
        if(oldProblem.matching != problemInfo.matching)
            await getConnection("WoodsTestDB").manager.update( ProblemEntity, id, { matching: problemInfo.matching });
        if(oldProblem.problemName != problemInfo.problemName)
            await getConnection("WoodsTestDB").manager.update( ProblemEntity, id, { problemName: problemInfo.problemName });
        if(oldProblem.problemGrade != problemInfo.problemGrade)
            await getConnection("WoodsTestDB").manager.update( ProblemEntity, id, { problemGrade: problemInfo.problemGrade });
        if(oldProblem.angle != problemInfo.angle)    
            await getConnection("WoodsTestDB").manager.update( ProblemEntity, id, { angle: problemInfo.angle });
        if(probAuthor.username != problemInfo.author){
            let newAuthor = await this.userRepos.searchByUsername(problemInfo.author)
            await getConnection("WoodsTestDB").manager.update( ProblemEntity, id, { authorEntity: newAuthor });
        }
        // Patch BaseHold Entities
        holdRepos.patchHoldsByProblemID(id, problemInfo);

        let updatedProblem = await this.searchById(id);
        return await this.translateToClientEntity(updatedProblem);
    }
}

export default new problemRepository();