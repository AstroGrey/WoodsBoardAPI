import { ProblemEntity } from './entities/problemEntity';
import { HoldEntity } from './entities/holdEntity';
import {EntityRepository, Repository, getRepository} from "typeorm";
import { getConnection } from 'typeorm';
import { holdRepository } from './holdRepository';
import { createConnection, Connection } from "typeorm";


@EntityRepository()
export class problemRepository extends Repository<ProblemEntity> {
   
    async createProblem(problem: ProblemEntity){
        console.log(problem.holdList.length);
        let newProblem = new ProblemEntity();
        newProblem.problemGrade = problem.problemGrade;
        newProblem.problemName = problem.problemName;
        newProblem.author = problem.author;
        //newProblem.angle = problem.angle;
        newProblem.holdCount = problem.holdList.length;
        newProblem.holdList = new Array(problem.holdList.length)
        for(var i = 0; i < problem.holdList.length; i++){ 
            // create new instance of Hold Entity
            newProblem.holdList[i] = new HoldEntity(); 
            newProblem.holdList[i].type = problem.holdList[i].type;
            newProblem.holdList[i].baseHoldLocation = problem.holdList[i].baseHoldLocation; 
         }
        let savedProblem = await getConnection("WoodsTestDB").manager.save(newProblem);
        for(var i = 0; i < savedProblem.holdList.length; i++){    
            // add new holds in db
            let holdRepos = new holdRepository();
            holdRepos.createHold(savedProblem.holdList[i].baseHoldLocation, savedProblem.holdList[i].type, savedProblem.id);
        }
        return newProblem;
    }

    async getAllProblems(): Promise <ProblemEntity []> {
        let probRepos = getConnection("WoodsTestDB").getRepository(ProblemEntity);
        let [savedProblems, totalProblems] = await probRepos.findAndCount();
        //let totalProblems = savedProblems[1]; 
        if(savedProblems != []){
            let savedProblemsFinal = Array(totalProblems);
            for(var i =0; i < totalProblems; i++){
                //console.log(typeof(savedProblems[0].id));
                savedProblemsFinal[i] = await this.searchById(savedProblems[i].id);
            }
            console.log("All problems from the db: ", savedProblems);
            //return savedProblems[0];
            return savedProblemsFinal;
        }
        else{
            console.log("No problems found");
            return []; 
        }
    }

    async getProblemHoldList(problemID: string): Promise <HoldEntity []>{
        let holdRepos = new holdRepository();
        let problemHoldList = await holdRepos.getHoldsByProblemId(problemID);
        return problemHoldList;
    }
   
    async searchById(id: any): Promise <ProblemEntity>{
        console.log("probRepos searchById");
        console.log(id);
        let probRepos = getConnection("WoodsTestDB").getRepository(ProblemEntity);
        let problem = await probRepos.findOne({
            where: {id : id}
        });
        if(problem){
            console.log("Found problem");
            //console.log("SearchById All holds for problem:");
            //console.log(problemHoldList);
            let problemHoldList = await this.getProblemHoldList(id);
            problem.holdList = Array(problem.holdCount);
            for(var i = 0; i < problem.holdCount; i++){
                problem.holdList[i] = new HoldEntity();
                //problem.holdList[i] = problemHoldList[i];
                problem.holdList[i].type = problemHoldList[i].type;
                problem.holdList[i].baseHoldLocation = problemHoldList[i].baseHoldLocation;
            }
            console.log("Returning Problem");
            return problem;
        }
        else{
            console.log("No problem");
            return problem!;
       }
    }

    async searchByUsername(username: string){
        return this.createQueryBuilder("problem")
            .where("problem.username = :username", { username })
    }

    async searchByName(problemName: string){
        console.log("probRepos searchByName");
        console.log(problemName);
        let probRepos = getConnection("WoodsTestDB").getRepository(ProblemEntity);
        let problem = await probRepos.findOne({
            where: {problemName : problemName}
        });
        if(problem){
            console.log("Found problem");
            return problem;
        }
        else{
            console.log("No problem");
            return problem!;
       }
    }

    async removeById(id: string){
        
    }
}