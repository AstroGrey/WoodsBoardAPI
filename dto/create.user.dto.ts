export interface CreateUserDto {
    id: string;
    email: string;
    password: string;
    username: string;
    firstName: string;
    lastName: string;
    permissionLevel?: number;
    apeIndex?: number;
    heightFeet?: number;
    heightInches?: number;
}
