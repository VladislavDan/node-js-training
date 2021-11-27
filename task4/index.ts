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

const app = express();
const port = 3000;

app.use(express.json());

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

app.use('/', UserRouter(new UserService(new UserModel())));
app.use('/', GroupRouter(new GroupService(new GroupModel())));
app.use('/', UserGroupRouter(new UserGroupService(new UserGroupModel())));
