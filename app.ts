import express from 'express';
import * as http from 'http';
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import cors from 'cors';
import { CommonRoutesConfig } from './common/common.routes.config';
import { UsersRoutes } from './users/users.routes.config';
import { ProblemsRoutes } from './problems/problems.routes';
import debug from 'debug';
import "reflect-metadata";
import { createConnection, Connection } from "typeorm";
import { ProblemEntity } from "./database/entities/problemEntity";
import { UserEntity } from "./database/entities/userEntity";
import { HoldEntity } from "./database/entities/holdEntity";
import { BaseHoldEntity } from './database/entities/baseHoldEntity';
import { LogSendEntity } from './database/entities/logSendEntity';
import { auth, requiredScopes } from 'express-oauth2-jwt-bearer';

const port = process.env.PORT || 3000;
const databaseHost = process.env.RDS_HOSTNAME || 'localhost';
const databasePort = process.env.RDS_PORT ? Number(process.env.RDS_PORT) : 5432;
const databaseName = process.env.RDS_DB_NAME || 'WoodsTestDB';
const databaseUsername = process.env.RDS_USERNAME || 'postgres';
const databasePassword = process.env.RDS_PASSWORD || 'toolis2cool';

const app: express.Application = express();
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const server: http.Server = http.createServer(app);
const routes: Array<CommonRoutesConfig> = [];
const debugLog: debug.IDebugger = debug('app');
const appSecret = 'bSpg5FcofMgK4EoDVytDwO5RhUJCgnjN';

const jwtCheck = jwt({
    secret: appSecret,
    audience: 'http://woodsapi-env.eba-ztpn3x24.us-west-1.elasticbeanstalk.com/',
    issuer: 'https://dev-l-w5mtaf.us.auth0.com/',
    algorithms: ['HS256']
});

app.use(express.json()); // adding middleware to parse all incoming requests as JSON 
app.use(cors()); // adding middleware to allow cross-origin requests
app.use(jwtCheck); 

const loggerOptions: expressWinston.LoggerOptions = {
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
        winston.format.json(),
        winston.format.prettyPrint(),
        winston.format.colorize({ all: true })
    ),
};

/* here we crash on unhandled errors and spitting out a stack trace,
 but only when in debug mode */
if (process.env.DEBUG) {
    process.on('unhandledRejection', function (reason) {
        debugLog('Unhandled Rejection:', reason);
        process.exit(1);
    });
} else {
    loggerOptions.meta = false; // when not debugging, make terse
}

app.use(expressWinston.logger(loggerOptions)); // initialize the logger with the above configuration

/* adding the UserRoutes to our array,
after sending the Express.js application object to have the routes added to our app!*/
routes.push(new UsersRoutes(app));
routes.push(new ProblemsRoutes(app));
//routes.push(new Auth0Route(app));

// Start our server at specified port
server.listen(port, () => {
    routes.forEach((route: CommonRoutesConfig) => { // for each route created and added to the array
        debugLog(`Routes configured for ${route.getName()}`);
    });
});

// Database Connection
createConnection({
    // use ormconfig.json here 
    type: "postgres",
    //host: databaseHost,
    host: "localhost",
    //port: databasePort,
    port: 5432,
    //username: databaseUsername,
    username: "postgres",
    //password: databasePassword,
    password: "toolis2cool",
    //name: databaseName,
    name: "WoodsTestDB",
    entities: [
        ProblemEntity,
        HoldEntity,
        UserEntity,
        BaseHoldEntity,
        LogSendEntity
    ],
    synchronize: true,
    logging: false
}).then(connection => {
    // here you can start to work with your entities
}).catch(error => console.log(error));