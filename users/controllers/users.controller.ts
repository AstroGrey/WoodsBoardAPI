import express from 'express';
import usersService from '../services/users.service';
import argon2 from 'argon2';
import debug from 'debug';

const log: debug.IDebugger = debug('app:users-controller');
class UsersController {
    async listUsers(req: express.Request, res: express.Response) {
        const users = await usersService.list();
        res.status(200).send(users);
    }

    async createUser(req: express.Request, res: express.Response) {
        req.body.password = await argon2.hash(req.body.password);
        const user = await usersService.create(req.body);
        res.status(201).send({ id: user.id });
    }

    async removeUser(req: express.Request, res: express.Response) {
        await usersService.deleteById(req.params.userId);
        res.status(204).send("user deleted");
    }
    
    async getUserById(req: express.Request, res: express.Response) {
        const user = await usersService.readById(req.params.userId);
        res.status(200).send(user);
    }

    async deleteAllUsers(req: express.Request, res: express.Response){
        await usersService.deleteUsers();
        res.status(200).send("All users deleted");
    }

    /*async patch(req: express.Request, res: express.Response) {
        if (req.body.password) {
            req.body.password = await argon2.hash(req.body.password);
        }
        log(await usersService.patchById(req.body.id, req.body));
        res.status(204).send();
    }*/
}

export default new UsersController();
