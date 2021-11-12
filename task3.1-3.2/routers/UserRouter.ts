import express, {NextFunction, Request, Response} from 'express';
import Joi, {ValidationErrorItem} from 'joi';
import {IErrorResponse} from '../types/IErrorResponse';
import {UserService} from '../services/UserService';

export const UserRouter = (userService: UserService) => {
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

    const router = express.Router();
    router.param('id', async (req: Request, res: Response, next: NextFunction, id: string) => {
        req.user = await userService.findById(id);
        next();
    });
    router.delete('/users/:id', async (req: Request, res: Response) => {
        const foundUser = req.user;
        if (!foundUser) {
            res.status(404).json(getNotFoundUserResponse(req.params.id));
        } else {
            await userService.deleteById(req.params.id);
            res.status(204).send();
        }
    });

    router.put('/users', validationMiddleware(), async (req: Request, res: Response) => {
        await userService.createUser(req.body.login, req.body.password, req.body.age, false);
        res.status(204).json('User created');
    });

    router.post('/users/:id', validationMiddleware(), async (req: Request, res: Response) => {
        const foundUser = req.user;

        if (!foundUser) {
            res.status(404).json(getNotFoundUserResponse(req.params.id));
        } else {
            const login = req.body.login || foundUser.login;
            const password = req.body.password || foundUser.password;
            const age = req.body.age || foundUser.age;
            await userService.changeUser(req.params.id, login, password, age, foundUser.isDeleted);
            res.status(204).json();
        }
    });

    router.get('/users/:id', (req: Request, res: Response) => {
        const foundUser = req.user;

        if (!foundUser) {
            res.status(404).json(getNotFoundUserResponse(req.params.id));
        } else {
            res.json(foundUser);
        }
    });

    router.get('/users', async (req: Request, res: Response) => {
        const loginSubstring = req.query.loginSubstring ? req.query.loginSubstring.toString() : '';
        const limit = Number(req.query.limit);
        const foundUsers = await userService.findByName(loginSubstring, limit);

        res.json(foundUsers);
    });

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

    const getNotFoundUserResponse = (id: string) => {
        return {
            message: `Employee with id: ${id}, not found`
        };
    };
    return router;
};
