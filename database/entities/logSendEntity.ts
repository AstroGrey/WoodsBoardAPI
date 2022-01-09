import {BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne} from "typeorm";
import { ProblemEntity } from "./problemEntity";
import { UserEntity } from "./userEntity";

@Entity("LogSendEntity")
export class LogSendEntity extends BaseEntity{

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    angleOfSend!: number;

    @Column({default: false}) // false = no, true = yes
    isMirrored!: boolean;

    @Column()
    dateOfLog!: string;

    @Column()
    suggestedGrade?: number;

    @Column({default: false})
    didFlash?: boolean;

    @Column() // rating will be thumbs up (didLike = true) or thumbs down (didLike = false)
    didLike!: boolean;

    @Column({default: false})
    isRepeat?: boolean;   

    @ManyToOne(() => UserEntity, user => user.loggedProblems)
    user!: UserEntity;

    @ManyToOne(() => ProblemEntity, problem => problem.logs)
    problem!: ProblemEntity;
}