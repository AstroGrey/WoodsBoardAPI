import {BaseEntity, Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToMany} from "typeorm";
import { ProblemEntity } from "./problemEntity";
import { LogSendEntity } from "./logSendEntity";

@Entity("UserEntity")
export class UserEntity extends BaseEntity{

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    firstName!: string;

    @Column()
    lastName!: string;

    @Column()
    username!: string;

    @Column()
    email!: string;

    @OneToMany(() => ProblemEntity, problem => problem.authorEntity, {eager: true})
    publishedProblems?: ProblemEntity[];

    @OneToMany(() => LogSendEntity, logSend => logSend.user, {eager: true})
    loggedProblems?: LogSendEntity[];

    //@Column({default: 0}) // number of published climbs
    //climbsCreated?: number;

    @Column({default: 0})
    heightInFeet?: number;

    @Column({default: 0})
    heightInInches?: number;

    @Column({default: 0})
    weight?: number;

    @Column({default: 0})
    apeIndex?: number;

    @Column()
    dateCreated!: string;

    @Column()
    password!: string;

    @Column()
    auth0id!: string;

    @Column({default: ""}) // date to be updated anytime a user earns a new auth0 token
    lastLoggedIn?: string;
}