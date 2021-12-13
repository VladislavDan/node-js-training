import express, {NextFunction, Request, Response} from 'express';
import {validationMiddleware} from '../common/validationMiddleware.js';
import Joi from 'joi';
import {UserGroupService} from '../services/UserGroupService.js';
import {serviceLoggerMiddleware} from '../common/serviceLoggerMiddleware.js';
import {Logger} from 'winston';
import {unhandledErrorLoggerMiddleware} from '../common/unhandledErrorLoggerMiddleware.js';

export const UserGroupRouter = (userGroupService: UserGroupService, logger: Logger) => {
    const schema = Joi.object().keys({
        userIds: Joi.array().required(),
        groupId: Joi.number().required()
    });
    const router = express.Router();

    router.put('/user-group',
        validationMiddleware(schema),
        serviceLoggerMiddleware(logger, 'userGroupService.addUsersToGroup'),
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                await userGroupService.addUsersToGroup(req.body.userIds, req.body.groupId);
                res.status(204).json('Users added to group');
            } catch (error) {
                next(error);
            }
        },
        unhandledErrorLoggerMiddleware(logger)
    );

    router.get('/user-group',
        serviceLoggerMiddleware(logger, 'userGroupService.getAll'),
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const foundGroups = await userGroupService.getAll();
                res.json(foundGroups);
            } catch (error) {
                next(error);
            }
        },
        unhandledErrorLoggerMiddleware(logger)
    );
    return router;
};
