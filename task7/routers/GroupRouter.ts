import express from 'express';
import {validationMiddleware} from '../common/validationMiddleware.js';
import Joi from 'joi';
import {serviceLoggerMiddleware} from '../common/serviceLoggerMiddleware.js';
import {Logger} from 'winston';
import {unhandledErrorLoggerMiddleware} from '../common/unhandledErrorLoggerMiddleware.js';
import {checkTokenMiddleware} from '../common/checkTokenMiddleware.js';
import cors from 'cors';
import {corsOptions} from '../common/Constants.js';
import {GroupController} from '../controllers/GroupController.js';

export const GroupRouter = (groupController: GroupController, logger: Logger) => {
    const schema = Joi.object().keys({
        name: Joi.string().required(),
        permissions: Joi.array().required()
    });
    const router = express.Router();
    router.param(
        'id',
        groupController.findGroupById
    );
    router.delete('/groups/:id',
        cors(corsOptions),
        checkTokenMiddleware(),
        serviceLoggerMiddleware(logger, 'groupService.deleteById'),
        groupController.deleteGroupById,
        unhandledErrorLoggerMiddleware(logger)
    );

    router.put('/groups',
        cors(corsOptions),
        checkTokenMiddleware(),
        validationMiddleware(schema),
        serviceLoggerMiddleware(logger, 'groupService.createGroup'),
        groupController.changeGroup,
        unhandledErrorLoggerMiddleware(logger)
    );

    router.post('/groups/:id',
        cors(corsOptions),
        checkTokenMiddleware(),
        validationMiddleware(schema),
        serviceLoggerMiddleware(logger, 'groupService.changeGroup'),
        groupController.createNewGroup,
        unhandledErrorLoggerMiddleware(logger)
    );

    router.get('/groups/:id',
        cors(corsOptions),
        checkTokenMiddleware(),
        serviceLoggerMiddleware(logger, 'groupService.findById'),
        groupController.getGroupById
    );

    router.get('/groups',
        cors(corsOptions),
        checkTokenMiddleware(),
        serviceLoggerMiddleware(logger, 'groupService.getAll'),
        groupController.getAllGroups,
        unhandledErrorLoggerMiddleware(logger)
    );
    return router;
};
