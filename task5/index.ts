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

app.use('/', UserRouter(new UserService(new UserModel()), logger));
app.use('/', GroupRouter(new GroupService(new GroupModel()), logger));
app.use('/', UserGroupRouter(new UserGroupService(new UserGroupModel()), logger));
