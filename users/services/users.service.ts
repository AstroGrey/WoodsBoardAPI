import { UsersDao } from '../daos/users.dao';
import { UserEntity } from '../../database/entities/userEntity';
 
class UsersService{
    UserDao = new UsersDao();

    async create(resource: UserEntity) {
        return this.UserDao.addUser(resource);
    }

    async list(){
        return this.UserDao.getUsers();
    }
    async getUserByEmail(email: string) {
        return this.UserDao.getUserByEmail(email);
    }
    async getUserByUsername(username: string){
        return this.UserDao.getUserByUsername(username);
    }
    /*(async deleteById(id: string) {
        return UsersDao.removeUserById(id);
    }

    async patchById(id: string, resource: PatchUserDto): Promise<any> {
        return UsersDao.patchUserById(id, resource);
    }

    async putById(id: string, resource: PutUserDto): Promise<any> {
        return UsersDao.putUserById(id, resource);
    }

    async readById(id: string) {
        return UsersDao.getUserById(id);
    }*/
}

export default new UsersService();
