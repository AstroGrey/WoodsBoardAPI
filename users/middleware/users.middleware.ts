import express from 'express';
import userService from '../services/users.service';
import debug from 'debug';
import * as EmailFormatValidator from 'email-validator';

const log: debug.IDebugger = debug('app:users-controller');
class UsersMiddleware {
    async validateRequiredUserBodyFields( // checks to see if request has at least email and password
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (req.body){ 
            if(!req.body.email){
                res.status(400).send({
                    error: `Invalid email`,
                });
            }
            else if(!req.body.password){
                res.status(400).send({
                    error: `Invalid password`,
                });
            }
            else if(!req.body.username){
                res.status(400).send({
                    error: `Invalid username`,
                });
            }
            else if(!req.body.firstName){
                res.status(400).send({
                    error: `Invalid first name`,
                });
            }
            else if(!req.body.lastName){
                res.status(400).send({
                    error: `Invalid last name`,
                });
            }
            next();
        } else {
            res.status(400).send({
                error: `Invalid fields. Please try again`,
            });
        }
    }

    async validateSameUsernameDoesntExist( // checks to see if username exists already 
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const user = await userService.getUserByUsername(req.body.username); // checks to see if user exists
        if (user) {
            res.status(400).send({ error: `Username already exists` }); // user exists, cannot create user
        } else {
            next(); // user doesnt exist, can move on to create
        }
    }

    async validateEmailFormat( // checks to see if email format is valid
        req: express.Request,
        res: express.Response, 
        next: express.NextFunction
    ){
        if(EmailFormatValidator.validate(req.body.email) == false){ // checks if email contains any invalid characters
            res.status(400).send({
                error: `Invalid email format. Please try again`,
            });
        }
        else{
            next();
        }
    }

    async validateUsernameExists( // response to '/users/:userId' request
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        var username =  "";
        if(req.params.username){
            console.log("user validateUsernameExists", req.params.username);
            username = req.params.username;
        }
        else if(req.params.author){
            console.log("problem validateUsernameExists", req.params.author);
            username = req.params.author;
        }
        const user = await userService.getUserByUsername(username); // searches for user id
        if (user) { // user id exists, move on
            next();
        } else { // user id does not exist, error
            res.status(404).send({
                error: `User ${req.params.username} not found`, 
            });
        }
    }

    async validateSameEmailDoesntExist( // checks to see if email exists already 
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const user = await userService.getUserByEmail(req.body.email); // checks to see if user exists
        if (user) {
            res.status(400).send({ error: `User email already exists` }); // user exists, cannot create user
        } else {
            next(); // user doesnt exist, can move on to create
        }
    }

    async extractUserId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.id = req.params.userId;
        next();
    }

    async extractUsername(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.username = req.params.username;
        next();
    }

    /*async validateSameEmailBelongToSameUser(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const user = await userService.getUserByEmail(req.body.email); // checks to see if user exists
        if (user && user.id === req.params.userId) { // if user exists && has userId, move on
            next(); 
        } else {
            res.status(400).send({ error: `Invalid email` }); // user email doesnt exist
        }
    }*/

    async validateUserIDExists( // response to '/users/:userId' request
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const user = await userService.readById(req.params.userId); // searches for user id
        if (user) { // user id exists, move on
            next();
        } else { // user id does not exist, error
            res.status(404).send({
                error: `User ${req.params.userId} not found`, 
            });
        }
    }
}

export default new UsersMiddleware();
