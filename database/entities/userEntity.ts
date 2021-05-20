import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
import shortid from 'shortid';

@Entity()
export class UserEntity {

    constructor(first: string, last: string, username: string){
        this.firstName = first;
        this.lastName = last;
        this.username = username;
        this.id = shortid.generate();
    }

    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    username: string;
}