import { ClientUserEntity } from '../../common/interfaces/clientUserEntiy';
import { UserRepository } from '../../database/userRepository';

class UsersService{
    usersRepos = new UserRepository();

    async create(resource: ClientUserEntity) {
        return this.usersRepos.createUser(resource);
    }
    async list(){
        return this.usersRepos.getAllUsers();
    }
    async getUserByEmail(email: string) {
        return this.usersRepos.searchByEmail(email);
    }
    async getUserByUsername(username: string){
        return this.usersRepos.searchByUsername(username);
    }
    async deleteById(id: string) {
        return this.usersRepos.removeById(id);
    }
    async readById(id: string) {
        return this.usersRepos.searchById(id);
    }
    async deleteUsers() {
        return this.usersRepos.deleteAllUsers();
    }
    async patchById(id: string, resource: ClientUserEntity): Promise<any> {
        return this.usersRepos.patchUserById(id, resource);
    }
}

export default new UsersService();
