import express from 'express';
import Joi from 'joi';
import {validationMiddleware} from '../common/validationMiddleware.js';
import {Logger} from 'winston';
import {serviceLoggerMiddleware} from '../common/serviceLoggerMiddleware.js';
import {unhandledErrorLoggerMiddleware} from '../common/unhandledErrorLoggerMiddleware.js';
import {checkTokenMiddleware} from '../common/checkTokenMiddleware.js';
import cors from 'cors';
import {corsOptions} from '../common/Constants.js';
import {UserController} from '../controllers/UserController.js';

export const UserRouter = (userController: UserController, logger: Logger) => {
    const schema = Joi.object().keys({
        login: Joi.string().required(),
        password: Joi.string().regex(/^[a-zA-Z0-9]+$/i).min(8).required(),
        age: Joi.number().min(4).max(130).required()
    });

    const router = express.Router();
    router.param('id', userController.findByUser);
    router.delete('/users/:id',
        cors(corsOptions),
        checkTokenMiddleware(),
        serviceLoggerMiddleware(logger, 'userService.deleteById'),
        userController.deleteById,
        unhandledErrorLoggerMiddleware(logger)
    );

    router.put('/users', validationMiddleware(schema),
        cors(corsOptions),
        checkTokenMiddleware(),
        serviceLoggerMiddleware(logger, 'userService.createUser'),
        userController.changeUser,
        unhandledErrorLoggerMiddleware(logger)
    );

    router.post('/users/:id',
        cors(corsOptions),
        checkTokenMiddleware(),
        validationMiddleware(schema),
        serviceLoggerMiddleware(logger, 'userService.changeUser'),
        userController.createUser,
        unhandledErrorLoggerMiddleware(logger)
    );

    router.get('/users/:id',
        cors(corsOptions),
        checkTokenMiddleware(),
        serviceLoggerMiddleware(logger, 'userService.findById'),
        userController.getUserById
    );

    router.get('/users',
        cors(corsOptions),
        checkTokenMiddleware(),
        serviceLoggerMiddleware(logger, 'userService.findByName'),
        userController.getAllUsers,
        unhandledErrorLoggerMiddleware(logger)
    );
    return router;
};
