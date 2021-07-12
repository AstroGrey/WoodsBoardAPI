import {Connection, EntityRepository, getRepository, Repository} from "typeorm";
import { BaseHoldEntity } from './entities/baseHoldEntity';
import { getConnection } from 'typeorm';

@EntityRepository()
export class baseHoldRepository extends Repository<BaseHoldEntity> {

    async createBaseHold(){

    }

    async getBaseHoldByLocation(location: number){ //: Promise <BaseHoldEntity>{
        let baseHoldRepository = getRepository(BaseHoldEntity);
        let baseHold = await baseHoldRepository.findOne({ 
            where: {location : location }
            });
        return baseHold;
    }
}