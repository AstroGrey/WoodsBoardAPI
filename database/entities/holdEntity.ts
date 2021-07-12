import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import { ProblemEntity  } from "./problemEntity";
import { BaseHoldEntity } from "./baseHoldEntity";
import { hold } from "../../common/holdClass";

@Entity()
export class HoldEntity{//} extends BaseHoldEntity{

    // Unique id to be stored in array in problems table (random string of characters)
    @PrimaryGeneratedColumn()
    id!: string;

    // foot, start, finish, hand
    @Column()
    type!: string;

    @Column()
    baseHoldLocation!: number;

    // which problem the hold belongs to
    @ManyToOne(type => ProblemEntity, ProblemEntity => ProblemEntity.holdList)
    problem!: number;
}