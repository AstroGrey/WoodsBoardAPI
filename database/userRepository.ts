import { UserEntity } from './entities/userEntity';
import { EntityRepository, Repository, getConnection } from "typeorm";
import { ProblemEntity } from './entities/problemEntity';
import { ClientUserEntity } from '../common/interfaces/clientUserEntiy';
import date from 'date-and-time';


@EntityRepository()
export class UserRepository extends Repository<UserEntity> {
    // Replace "getConnection("WoodsTestDB").manager" with "this.userRepos" before uploading to official server
    // userRepos = getConnection(process.env.RDS_DB_NAME).getRepository(UserEntity); 

    async translateToClientEntity(user: UserEntity): Promise<ClientUserEntity> {
        const clientEntity: ClientUserEntity = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            email: user.email,
            auth0id: user.auth0id,
            password: "",
            dateCreated: user.dateCreated,
            heightInFeet: user.heightInFeet,
            heightInInches: user.heightInInches,
            weight: user.weight,
            apeIndex: user.apeIndex
        };
        return clientEntity;
    }

    async createUser(user: ClientUserEntity): Promise<ClientUserEntity> {
        console.log("Creating user: ", user);

        let newUser = new UserEntity();

        // Assign User Attributes
        newUser.firstName = user.firstName;
        newUser.lastName = user.lastName;
        newUser.username = user.username;
        newUser.email = user.email;
        newUser.password = user.password;
        newUser.auth0id = user.auth0id;
        newUser.heightInFeet = user.heightInFeet;
        newUser.heightInInches = user.heightInInches;
        newUser.weight = user.weight;
        newUser.apeIndex = user.apeIndex;

        // Save Date Account was Created
        let now = new Date();
        newUser.dateCreated = date.format(now, 'MM/DD/YYYY HH:mm:ss');

        // Save new user entity
        let savedUser = this.translateToClientEntity(await getConnection("WoodsTestDB").manager.save(newUser));
        console.log("User created");
        return savedUser;
    }

    async getAllUsers(): Promise<ClientUserEntity[]> {
        // Returns all climbs in savedProblems, total of climbs in totalProblems
        let [savedUsers, totalUsers] = await getConnection("WoodsTestDB").manager.findAndCount(UserEntity);
        if (savedUsers != []) {
            let savedUsersFinal: ClientUserEntity[];
            savedUsersFinal = Array(totalUsers);
            for (var i = 0; i < totalUsers; i++) {
                //console.log("User: ", i, " of list ", savedUsers[i].author);
                savedUsersFinal[i] = await this.translateToClientEntity(await this.searchById(savedUsers[i].id));
            }
            console.log("All Users from the db: ", savedUsers);
            return savedUsersFinal;
        }
        else {
            console.log("No problems found");
            return [];
        }
    }

    async getUsernameOfProblem(probId: any): Promise<string> {
        console.log("getUsernameOfProblem: ", probId);
        let user = await getConnection("WoodsTestDB").manager.findOne(UserEntity, {
            where: { publishedProblems: probId }
        });

        if (user) {
            console.log("Found user by PROBid", user);
            return user.username;
        }
        else {
            return "";
        }
    }

    async getUsernameByEntity(id: any): Promise<string> {
        console.log("getUsernameById: ", id);
        if (id) {
            let user = await this.searchById(id);
            return user.username;
        }
        else {
            return "";
        }
    }

    async searchById(id: any): Promise<UserEntity> {
        console.log("Searching for user of id", id);
        let user = await getConnection("WoodsTestDB").manager.findOne(UserEntity, {
            where: { id: id }
        });
        if (user) {
            console.log("Found user by id");
            //let clientUser = this.translateToClientEntity(user);
            return user;
        }
        else {
            console.log("No user with that id");
            return user!;
        }
    }

    async searchByUsername(username: string): Promise<UserEntity> {
        console.log("searchByUsername", username);
        let user = await getConnection("WoodsTestDB").manager.findOne(UserEntity, {
            where: { username: username }
        });
        if (user) {
            console.log("Found user by username");
            return user;
        }
        else {
            console.log("No user with that username");
            return user!;
        }
    }

    async searchByEmail(email: string): Promise<UserEntity> {
        let user = await getConnection("WoodsTestDB").manager.findOne(UserEntity, {
            where: { email: email }
        });
        if (user) {
            console.log("Found user by email");
            return user;
        }
        else {
            console.log("No user with that email");
            return user!;
        }
    }

    async deleteAllUsers() {
        console.log("deleteAllUsers");
        let users = await this.getAllUsers();
        await getConnection("WoodsTestDB").manager.remove(
            users
        );
    }

    async patchUserById(id: any, userInfo: ClientUserEntity): Promise<ClientUserEntity> {
        console.log("Patch user:", userInfo);
        let oldUser = await this.searchById(id);

        if (oldUser.firstName != userInfo.firstName)
            await getConnection("WoodsTestDB").manager.update(UserEntity, id, { firstName: userInfo.firstName });
        if (oldUser.lastName != userInfo.lastName)
            await getConnection("WoodsTestDB").manager.update(UserEntity, id, { firstName: userInfo.lastName });
        if (oldUser.username != userInfo.username)
            await getConnection("WoodsTestDB").manager.update(UserEntity, id, { username: userInfo.username });
        if (oldUser.username != userInfo.username)
            await getConnection("WoodsTestDB").manager.update(UserEntity, id, { username: userInfo.username });

        let updatedUser = await this.searchById(id);
        return await this.translateToClientEntity(updatedUser);
    }

    async removeById(id: any) {
        await getConnection("WoodsTestDB").manager.delete(UserEntity, {
            id: id
        });
    }
}

export default new UserRepository();