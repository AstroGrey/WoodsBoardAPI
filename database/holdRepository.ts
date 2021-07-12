import { HoldEntity } from './entities/holdEntity';
import {EntityRepository, Repository} from "typeorm";
import { getConnection } from 'typeorm';
import { BaseHoldEntity } from './entities/baseHoldEntity';
import { baseHoldRepository } from './baseHoldRepository';
import shortid from "shortid";

@EntityRepository()
export class holdRepository extends Repository<HoldEntity> {
    baseHoldRepos = new baseHoldRepository();

    async createHold(holdLocation: number, holdType: string, problemId: number){
        let newHold = new HoldEntity();
        newHold.type = holdType;
        newHold.baseHoldLocation = holdLocation;
        newHold.problem = problemId;
        // save hold in db
        await getConnection("WoodsTestDB").manager.save(newHold);
    }

    async getHoldsByProblemId(problemId: string): Promise<HoldEntity[]>{
        let problemHolds = await getConnection("WoodsTestDB").manager.find(HoldEntity); 
        if(problemHolds != []){
            //console.log("All holds for problem:", problemId, problemHolds);
            return problemHolds;
        }
        else{
            console.log("No holds for problem of problemId = ", problemId);
            return []; 
        }
    }
}

