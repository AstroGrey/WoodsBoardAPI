import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
import { hold } from  '../../common/holdClass';

@Entity()
export class ProblemEntity{

    /*constructor(title: string, grade: number, username: string, holds: hold[]){
        this.problemName = title;
        this.author = username;
        this.problemGrade = grade;
        this.id = shortid.generate();
        this.holdList = [];
        var length; 
        for(length in holds){
            this.holdList[length] = new hold(holds[length].getType(), holds[length].getLocation());
        }
    }*/
    @PrimaryGeneratedColumn()
    id!: string;

    @Column()
    problemName!: string;

    @Column()
    author!: string;

    @Column()
    problemGrade!: number;

    @Column()
    holdList!: Array<hold>;
}