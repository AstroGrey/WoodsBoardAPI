import {BaseEntity, Entity, PrimaryGeneratedColumn, Column} from "typeorm";


@Entity()
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

    @Column()
    password!: string;
}