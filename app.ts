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

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port = 3000;
const routes: Array<CommonRoutesConfig> = [];
const debugLog: debug.IDebugger = debug('app');

app.use(express.json()); // adding middleware to parse all incoming requests as JSON 
app.use(cors()); // adding middleware to allow cross-origin requests

/* preparing the expressWinston logging middleware configuration,
 which will automatically log all HTTP requests handled by Express.js */
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
    process.on('unhandledRejection', function(reason) {
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

// this is a simple route to make sure everything is working properly
app.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).send(`Server running at http://localhost:${port}`);
});

// Start our server at specified port
server.listen(port, () => { 
    //debugLog(`Heh its the weed number http://localhost:${port}`);
    routes.forEach((route: CommonRoutesConfig) => { // for each route created and added to the array
        debugLog(`Routes configured for ${route.getName()}`);
    });
});

// Database Connection
//const connection = await 
createConnection({
    // use ormconfig.json here 
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "toolis2cool",
    name: "WoodsTestDB",
    entities: [
        ProblemEntity,
        UserEntity,
        HoldEntity,
        BaseHoldEntity
    ],
    synchronize: true,
    logging: false
}).then(connection => {
    // here you can start to work with your entities
}).catch(error => console.log(error));