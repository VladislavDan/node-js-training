import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

const users = [{
    id: uuidv4(),
    login: 'FirstUser',
    password: 'qwerty123',
    age: 31,
    isDeleted: false
}];

const app = express();
const port = 3000;

app.use(express.json());

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

router.param('id', (req, res, next, id) => {
    req.user = users.find((user) => {
        return user.id === id;
    });
    next();
});

router.put('/users', (req, res) => {
    users.push({
        ...req.body,
        id: uuidv4(),
        isDeleted: false
    });

    res.status(204).json('User created');
});

router.post('/users/:id', (req, res) => {
    const foundUser = req.user;

    if (!foundUser) {
        res.status(404).json(getNotFoundUserResponse(req.param.id));
    } else {
        foundUser.login = req.body.login || foundUser.login;
        foundUser.password = req.body.password || foundUser.password;
        foundUser.age = req.body.age || foundUser.age;
        res.status(204).json();
    }
});

router.get('/users/:id', (req, res) => {
    const foundUser = req.user;

    if (!foundUser) {
        res.status(404).json(getNotFoundUserResponse(req.param.id));
    } else {
        res.json(foundUser);
    }
});

router.get('/users', (req, res) => {
    const loginSubstring = req.query.loginSubstring;
    const limit = req.query.limit;
    const foundUsers = users.filter((user, index) => {
        if (index + 1 > limit) {
            return false;
        }
        return user.login && user.login.indexOf(loginSubstring) > -1;
    });

    res.json(foundUsers);
});

router.delete('/users/:id', (req, res) => {
    const foundUser = req.user;
    if (!foundUser) {
        res.status(404).json(getNotFoundUserResponse(req.param.id));
    } else {
        foundUser.isDeleted = true;
        res.status(204).send();
    }
});

app.use('/', router);

const getNotFoundUserResponse = (id) => {
    return {
        message: `Employee with id: ${id}, not found`
    };
};
