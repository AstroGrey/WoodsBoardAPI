import { HoldEntity } from './entities/holdEntity';
import {EntityRepository, Repository, getConnection} from "typeorm";
import { BaseHoldEntity } from './entities/baseHoldEntity';
import baseHoldRepos from './baseHoldRepository';
import { ProblemEntity } from './entities/problemEntity';
import problemRepos from './problemsRepository';
import { ClientHoldEntity } from '../common/interfaces/clientHoldEntity';
import { ClientProblemEntity } from '../common/interfaces/clientProblemEntity';

@EntityRepository()
export class holdRepository extends Repository<HoldEntity> {

    // Replace "getConnection("WoodsTestDB").manager" with "this.holdRepos" before uploading to official server
    // holdRepos = getConnection(process.env.RDS_DB_NAME).getRepository(HoldEntity); 

    async createHold(holdLocation: number, holdType: string, problemId: number){
        console.log("Creating hold for problem", problemId);
        let newHold = new HoldEntity();

        // Save Hold Problem Attributes
        newHold.problem = problemId;
        newHold.type = holdType;

        // Relate Hold to BaseHold 
        let tempBaseHold = new BaseHoldEntity();
        tempBaseHold = await baseHoldRepos.getBaseHoldByLocation(holdLocation);
        console.log("using Basehold ", tempBaseHold);
        newHold.baseHoldId = tempBaseHold.id;

        // save hold in db
        await getConnection("WoodsTestDB").manager.save(newHold);
        console.log("Hold created: ", newHold);
    }

    async translateToClientHoldEntity(hold: HoldEntity): Promise<ClientHoldEntity>{
        let baseHold = await baseHoldRepos.getBaseHoldById(hold.baseHoldId);
        const clientEntity: ClientHoldEntity = {
            type: hold.type,
            baseHoldLocation: baseHold.location
        };
        return clientEntity;
    }

    async translateToClientHoldList(problemHoldList: HoldEntity[]): Promise<ClientHoldEntity[]>{
        let clientHoldList : ClientHoldEntity[];
        clientHoldList = Array(problemHoldList.length);
        for(var i = 0; i < problemHoldList.length; i++){
            let clientHold = await this.translateToClientHoldEntity(problemHoldList[i]);
            clientHoldList[i].type = clientHold.type;
            clientHoldList[i].baseHoldLocation = clientHold.baseHoldLocation;
        }
        return clientHoldList;
    }

    async patchHoldsByProblemID(problemId: any, updatedProblem: ClientProblemEntity){
        let holdList = await this.getHoldsByProblemId(problemId, updatedProblem.holdCount);
        let updatedHoldList = Array(updatedProblem.holdCount);
        for(var i = 0; i < updatedProblem.holdCount; i++){ 
            console.log(holdList[i].id);

            let tempbaseHold = await baseHoldRepos.getBaseHoldById(updatedProblem.holdList[i].baseHoldLocation);
            
            await getConnection("WoodsTestDB").manager.update(HoldEntity, holdList[i].id, 
                { baseHoldId: tempbaseHold.id }
            )
            await getConnection("WoodsTestDB").manager.update(HoldEntity, holdList[i].id, 
                { problem: problemId }
            )
            await getConnection("WoodsTestDB").manager.update(HoldEntity, holdList[i].id, 
                { type: updatedProblem.holdList[i].type }
            )

            updatedHoldList[i] = this.translateToClientHoldEntity(holdList[i]);
        }
    }

    async getHoldsByProblemId(problemId: any, holdCount: number): Promise<HoldEntity[]>{
        console.log("All holds for problem:", problemId, "With hold count:", holdCount);
        let problemHolds = Array(holdCount);
        problemHolds = await getConnection("WoodsTestDB").manager.find(HoldEntity, {
            where: { problem : problemId }
        });
        if(problemHolds != []){
            console.log("All holds for problem:", problemId, problemHolds);
            return problemHolds;
        }
        else{
            console.log("No holds for problem of problemId = ", problemId);
            return []; 
        }
    }

    async deleteHoldsByProblemId(problemId: any, holdCount: any){
        console.log("Delete holds for problem:", problemId);
        let holdsToRemove = await this.getHoldsByProblemId(problemId, holdCount);
        await getConnection("WoodsTestDB").manager.remove(
            holdsToRemove
        );
    }
}

export default new holdRepository();