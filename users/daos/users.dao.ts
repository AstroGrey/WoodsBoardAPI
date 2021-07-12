
import debug from 'debug';
import { UserEntity } from '../../database/entities/UserEntity';
import { UserRepository } from '../../database/userRepository';
import UsersMiddleware from '../middleware/users.middleware';

const log: debug.IDebugger = debug('app:in-memory-dao');

export class UsersDao {
    usersRepos = new UserRepository();

    constructor() {
        log('Created new instance of UsersDao');
    }

    async addUser(user: UserEntity) {
        this.usersRepos.createUser(user);
    }

    async getUsers() {
        return this.usersRepos.getAllUsers();
    }

    async getUserById(userId: string) {
        return this.usersRepos.searchById(userId);
    }

    async getUserByUsername(username: string) {
        return this.usersRepos.searchByUsername(username);
    }

    async getUserByEmail(email: string){
        return this.usersRepos.searchByEmail(email);
    }

    /*(async putUserById(userId: string, user: PutUserDto) {
        const objIndex = this.users.findIndex(
            (obj: { id: string }) => obj.id === userId);
        this.users.splice(objIndex, 1, user);
        return `${user.id} updated via put`;
    }

    async patchUserById(userId: string, user: PatchUserDto) {
        const objIndex = this.users.findIndex(
            (obj: { id: string }) => obj.id === userId);
        let currentUser = this.users[objIndex];
        const allowedPatchFields = [
            'password',
            'firstName',
            'lastName',
            'permissionLevel',
        ];
        for (let field of allowedPatchFields) {
            if (field in user) {
                // @ts-ignore
                currentUser[field] = user[field];
            }
        }
        this.users.splice(objIndex, 1, currentUser);
        return `${user.id} patched`;
    }

    async removeUserById(userId: string) {
        const objIndex = this.users.findIndex(
            (obj: { id: string }) => obj.id === userId);
        this.users.splice(objIndex, 1);
        return `${userId} removed`;
    }*/
}
