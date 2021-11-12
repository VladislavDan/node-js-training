import express from 'express';
import {UserRouter} from './routers/UserRouter.js';
import {UserModel} from './models/UserModel.js';
import {UserService} from './services/UserService.js';

const app = express();
const port = 3000;

app.use(express.json());

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

app.use('/', UserRouter(new UserService(new UserModel())));
