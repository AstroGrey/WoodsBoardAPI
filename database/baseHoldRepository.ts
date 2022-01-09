import { EntityRepository, Repository, getRepository, getConnection} from "typeorm";
import { BaseHoldEntity } from './entities/baseHoldEntity';

@EntityRepository()
export class baseHoldRepository extends Repository<BaseHoldEntity> {
    
    // Replace "getConnection("WoodsTestDB").manager" with "this.baseHoldRepos" before uploading to AWS
    // baseHoldRepos= getConnection(process.env.RDS_DB_NAME).getRepository(BaseHoldEntity);

    async getBaseHoldByLocation(location: number): Promise <BaseHoldEntity>{

        console.log("getting baseHold by location: ", location);
        let baseHold = await getConnection("WoodsTestDB").manager.findOne(BaseHoldEntity, { 
                where: {location : location }
            });
        if(baseHold){
            console.log(baseHold);
            return baseHold;
        }
        else{
            console.log("Hold Not Found");
            return baseHold!;
        }
    }

    async getBaseHoldById(baseHoldId: number): Promise <BaseHoldEntity>{
        let baseHold = await getConnection("WoodsTestDB").manager.findOne(BaseHoldEntity,{
            where: {id : baseHoldId}
        })
        if(baseHold){
            return baseHold;
        }
        else{
            return baseHold!;
        }
    }
}

export default new baseHoldRepository();