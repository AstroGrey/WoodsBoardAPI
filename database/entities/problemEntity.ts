import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToMany, ManyToOne} from "typeorm";
import { HoldEntity } from "./holdEntity";
import { UserEntity } from "./userEntity";
import { LogSendEntity } from "./logSendEntity";

@Entity("ProblemEntity")
export class ProblemEntity{

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    problemName!: string;

    @ManyToOne(() => UserEntity, user => user.publishedProblems)
    authorEntity!: UserEntity;
    
    @Column()
    problemGrade!: number;

    @Column({default: 0})
    repeats?: number;

    @Column({default: 0})
    communitySuggestedGrade?: number;

    @Column()
    holdCount!: number;

    @Column({default: false})
    isBenchmark?: boolean;

    @Column({default: false})
    isProject?: boolean;

    @OneToMany(() => HoldEntity, hold => hold.problem, { cascade: true})
    holdList!: HoldEntity[];

    @Column()
    angle!: number;

    // If true, matching is allowed. If false, no matching
    @Column({default: true})
    matching?: boolean; 

    @Column()
    datePublished!: string;

    @Column({default: 0})
    proposedGrade?: number;

    @Column({default: 0})
    totalLogLikes?: number;

    @Column({default: 0})
    totalLogDislikes?: number;

    @OneToMany(() => LogSendEntity, logSend => logSend.problem, {eager: true})
    logs?: LogSendEntity[];
}