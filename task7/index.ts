import express from 'express';
import {UserRouter} from './routers/UserRouter.js';
import {UserModel} from './models/UserModel.js';
import {UserService} from './services/UserService.js';
import {GroupRouter} from './routers/GroupRouter.js';
import {GroupModel} from './models/GroupModel.js';
import {GroupService} from './services/GroupService.js';
import {UserGroupRouter} from './routers/UserGroupRouter.js';
import {UserGroupService} from './services/UserGroupService.js';
import {UserGroupModel} from './models/UserGroupModel.js';
import winston from 'winston';
import {AuthenticateRouter} from './routers/AuthenticateRouter.js';
import {AuthenticateService} from './services/AuthenticateService.js';
import {UserController} from './controllers/UserController.js';
import {GroupController} from './controllers/GroupController.js';

const app = express();
const port = 3000;

app.use(express.json());

const logger = winston.createLogger();

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

process.on('uncaughtException', (err) => {
    logger.log({
        level: 'error',
        message: `Error: ${JSON.stringify(err)}`
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

app.use('/', AuthenticateRouter(new AuthenticateService(new UserModel())));
app.use('/', UserRouter(new UserController(new UserService(new UserModel())), logger));
app.use('/', GroupRouter(new GroupController(new GroupService(new GroupModel())), logger));
app.use('/', UserGroupRouter(new UserGroupService(new UserGroupModel()), logger));
