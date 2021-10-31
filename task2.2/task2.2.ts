import express, { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Joi, { ValidationErrorItem } from 'joi';

const router = express.Router();

const users: Array<IUser> = [{
    id: uuidv4(),
    login: 'FirstUser',
    password: 'qwerty123',
    age: 31,
    isDeleted: false
}];

const app = express();
const port = 3000;

app.use(express.json());

const errorResponse = (schemaErrors: ValidationErrorItem[]): IErrorResponse => {
    const errors = schemaErrors.map((error) => {
        const { path, message } = error;
        return { path, message };
    });
    return {
        status: 'failed',
        errors
    };
};

const schema = Joi.object().keys({
    login: Joi.string().required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]+$/i).min(8).required(),
    age: Joi.number().min(4).max(130).required()
});

const validationMiddleware = () => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const {error} = schema.validate(req.body, {
            abortEarly: false,
            allowUnknown: false
        });

        if (error && error.isJoi) {
            res.status(400).json(errorResponse(error.details));
        } else {
            next();
        }
    };
};

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

router.param('id', (req: Request, res: Response, next: NextFunction, id: string): void => {
    req.user = users.find((user) => {
        return user.id === id;
    });
    next();
});

router.put('/users', validationMiddleware(), (req: Request, res: Response) => {
    users.push({
        ...req.body,
        id: uuidv4(),
        isDeleted: false
    });

    res.status(204).json('User created');
});

router.post('/users/:id', validationMiddleware(), (req: Request, res: Response) => {
    const foundUser = req.user;

    if (!foundUser) {
        res.status(404).json(getNotFoundUserResponse(req.params.id));
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
        res.status(404).json(getNotFoundUserResponse(req.params.id));
    } else {
        res.json(foundUser);
    }
});

router.get('/users', (req: Request, res: Response) => {
    const loginSubstring = req.query.loginSubstring ? req.query.loginSubstring.toString() : '';
    const limit = Number(req.query.limit);
    const foundUsers = users.filter((user, index) => {
        if (index + 1 > limit) {
            return false;
        }
        return user.login && user.login.indexOf(loginSubstring) > -1;
    });

    res.json(foundUsers);
});

router.delete('/users/:id', (req: Request, res: Response) => {
    const foundUser = req.user;
    if (!foundUser) {
        res.status(404).json(getNotFoundUserResponse(req.params.id));
    } else {
        foundUser.isDeleted = true;
        res.status(204).send();
    }
});

app.use('/', router);

const getNotFoundUserResponse = (id: string) => {
    return {
        message: `Employee with id: ${id}, not found`
    };
};

interface IUser {
    id: string;
    login: string;
    password: string;
    age: number;
    isDeleted: boolean;
}

interface IErrorResponse {
    status: string;
    errors: Array<{
        path: Array<string | number>;
        message: string;
    }>
}
