export interface PutUserDto {
    id: string;
    email: string;
    password: string;
    username: string;
    firstName: string;
    lastName: string;
    permissionLevel: number;
}
