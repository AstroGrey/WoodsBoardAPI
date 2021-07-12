import {BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import { HoldEntity } from "./holdEntity";
import { hold } from "../../common/holdClass";

@Entity()
export class ProblemEntity{ // extends BaseEntity{

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    problemName!: string;

    @Column()
    author!: string;

    @Column()
    problemGrade!: number;

    @Column({default: 0})
    holdCount!: number;

    @OneToMany(type => HoldEntity, holdEntity => holdEntity.problem)
    holdList!: HoldEntity[];

    //@Column()
    //angle!: number;

    //@Column()
    //datePublished!: string;
}