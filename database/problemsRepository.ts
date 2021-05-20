import { ProblemEntity } from './entities/problemEntity';
import { hold } from  './../common/holdClass';
import {EntityRepository, Repository} from "typeorm";
import { createConnection } from "typeorm";

@EntityRepository()
export class problemRepository extends Repository<ProblemEntity> {

    //super(title: string, grade: number, username: string, holds: hold[]){}
    createProblem(title: string, grade: number, username: string, holds: hold[]){
        createConnection(/*...*/).then(async connection => {

            let problem = new ProblemEntity();
            problem.problemName = title;
            problem.problemGrade = grade;
            problem.author = username;
            problem.holdList = [];
            var length; 
            for(length in holds){
            problem.holdList[length] = new hold(holds[length].getType(), holds[length].getLocation());
        }
            await connection.manager.save(problem);
            console.log("Problem has been saved");
        }).catch(error => console.log(error));
    }
   
    getAllProblems(){
        createConnection(/*...*/).then(async connection => {

            /*...*/
            let savedPhotos = await connection.manager.find(ProblemEntity);
            console.log("All photos from the db: ", savedPhotos);
        
        }).catch(error => console.log(error));
    }

    searchByUsername(username: string) {
        return this.createQueryBuilder("problem")
            .where("problem.username = :username", { username })
            .getMany();
    }

    searchByName(problemName: string) {
        return this.createQueryBuilder("problem")
            .where("problem.problemName = :problemName", { problemName })
            .getMany();
    }

}