import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

/* This class will handle the creation of all base holds, 
their position on the board, descriptors (crimpy, slopy, pinch, etc),
and an ID to be used in the problemHoldList
*/
@Entity("BaseHoldEntity")
export class BaseHoldEntity{

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    descriptor!: string;

    @Column()
    hold!: string;

    @Column()
    location!: number;
}