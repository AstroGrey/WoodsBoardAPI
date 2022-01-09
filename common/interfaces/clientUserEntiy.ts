export interface ClientUserEntity{
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    auth0id: string;
    dateCreated: string;
    heightInFeet?: number;
    heightInInches?: number;
    weight?: number;
    apeIndex?: number;
}
