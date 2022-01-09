import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne} from "typeorm";
import { BaseHoldEntity } from "./baseHoldEntity";
import { ProblemEntity  } from "./problemEntity";

@Entity("HoldEntity")
export class HoldEntity{//} extends BaseHoldEntity{

    // Unique id to be stored in array in problems table (random string of characters)
    @PrimaryGeneratedColumn()
    id!: number;

    // foot = 3, start = 1, finish = 4, hand = 2
    @Column()
    type!: string;

    @ManyToOne(() => BaseHoldEntity)
    baseHoldId!: number;

    // which problem the hold belongs to
    @ManyToOne(() => ProblemEntity, problem => problem.holdList)
    problem!: number;
}