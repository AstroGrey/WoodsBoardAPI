import { UserEntity } from './entities/userEntity';
import {EntityRepository, Repository} from "typeorm";
import { getConnection } from 'typeorm';
import { createConnection } from 'typeorm';


@EntityRepository()
export class UserRepository extends Repository<UserEntity> {
   async createUser(user: UserEntity){
        let newUser = new UserEntity();
        newUser.firstName = user.firstName;
        newUser.lastName = user.lastName;
        newUser.username = user.username;
        newUser.email = user.email;
        newUser.password = user.password;
        getConnection("WoodsTestDB").manager.save(newUser);
        return newUser.id;
    }
   
    async getAllUsers(): Promise <UserEntity []> {
        let savedUsers = await getConnection("WoodsTestDB").manager.find(UserEntity);
        if(savedUsers != []){
            console.log("All users from the db: ", savedUsers);
            return savedUsers;
        }
        else{
            console.log("No users found");
            return []; 
        }
    }

    async searchById(id: string){
        return this.createQueryBuilder("user")
            .where("user.id = :id", { id })
    }

    async searchByUsername(username: string){
        return this.createQueryBuilder("user")
            .where("user.username = :username", { username })
    }

    async searchByEmail(email: string){
        return this.createQueryBuilder("user")
            .where("user.email = :email", { email })
    }
    async removeById(id: string){
        
    }
}