import express, {NextFunction, Request, Response} from 'express';
import Joi from 'joi';
import {UserService} from '../services/UserService';
import {validationMiddleware} from '../common/validationMiddleware.js';
import {Logger} from 'winston';
import {serviceLoggerMiddleware} from '../common/serviceLoggerMiddleware.js';
import {unhandledErrorLoggerMiddleware} from '../common/unhandledErrorLoggerMiddleware.js';

export const UserRouter = (userService: UserService, logger: Logger) => {
    const schema = Joi.object().keys({
        login: Joi.string().required(),
        password: Joi.string().regex(/^[a-zA-Z0-9]+$/i).min(8).required(),
        age: Joi.number().min(4).max(130).required()
    });

    const router = express.Router();
    router.param('id', async (req: Request, res: Response, next: NextFunction, id: string) => {
        req.user = await userService.findById(id);
        next();
    });
    router.delete('/users/:id',
        serviceLoggerMiddleware(logger, 'userService.deleteById'),
        async (req: Request, res: Response, next: NextFunction) => {
            const foundUser = req.user;
            if (!foundUser) {
                res.status(404).json(getNotFoundUserResponse(req.params.id));
            } else {
                try {
                    await userService.deleteById(req.params.id);
                    res.status(204).send();
                } catch (error) {
                    next(error);
                }
            }
        },
        unhandledErrorLoggerMiddleware(logger)
    );

    router.put('/users', validationMiddleware(schema),
        serviceLoggerMiddleware(logger, 'userService.createUser'),
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                await userService.createUser(req.body.login, req.body.password, req.body.age, false);
                res.status(204).json('User created');
            } catch (error) {
                next(error);
            }
        },
        unhandledErrorLoggerMiddleware(logger)
    );

    router.post('/users/:id',
        validationMiddleware(schema),
        serviceLoggerMiddleware(logger, 'userService.changeUser'),
        async (req: Request, res: Response, next: NextFunction) => {
            const foundUser = req.user;

            if (!foundUser) {
                res.status(404).json(getNotFoundUserResponse(req.params.id));
            } else {
                const login = req.body.login || foundUser.login;
                const password = req.body.password || foundUser.password;
                const age = req.body.age || foundUser.age;
                try {
                    await userService.changeUser(req.params.id, login, password, age, foundUser.isDeleted);
                    res.status(204).json();
                } catch (error) {
                    next(error);
                }
            }
        },
        unhandledErrorLoggerMiddleware(logger)
    );

    router.get('/users/:id',
        serviceLoggerMiddleware(logger, 'userService.findById'),
        (req: Request, res: Response) => {
            const foundUser = req.user;

            if (!foundUser) {
                res.status(404).json(getNotFoundUserResponse(req.params.id));
            } else {
                res.json(foundUser);
            }
        }
    );

    router.get('/users',
        serviceLoggerMiddleware(logger, 'userService.findByName'),
        async (req: Request, res: Response, next: NextFunction) => {
            const loginSubstring = req.query.loginSubstring ? req.query.loginSubstring.toString() : '';
            const limit = Number(req.query.limit);
            try {
                const foundUsers = await userService.findByName(loginSubstring, limit);
                res.json(foundUsers);
            } catch (error) {
                next(error);
            }
        },
        unhandledErrorLoggerMiddleware(logger)
    );

    const getNotFoundUserResponse = (id: string) => {
        return {
            message: `Employee with id: ${id}, not found`
        };
    };
    return router;
};
