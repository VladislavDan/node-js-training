import express, {NextFunction, Request, Response} from 'express';
import {validationMiddleware} from '../common/validationMiddleware.js';
import Joi from 'joi';
import {GroupService} from '../services/GroupService';
import {serviceLoggerMiddleware} from '../common/serviceLoggerMiddleware.js';
import {Logger} from 'winston';
import {unhandledErrorLoggerMiddleware} from '../common/unhandledErrorLoggerMiddleware.js';
import {checkTokenMiddleware} from '../common/checkTokenMiddleware.js';
import cors from 'cors';
import {corsOptions} from '../common/Constants.js';

export const GroupRouter = (groupService: GroupService, logger: Logger) => {
    const schema = Joi.object().keys({
        name: Joi.string().required(),
        permissions: Joi.array().required()
    });
    const router = express.Router();
    router.param(
        'id',
        async (req: Request, res: Response, next: NextFunction, id: string) => {
            req.body.group = await groupService.findById(id);
            next();
        }
    );
    router.delete('/groups/:id',
        cors(corsOptions),
        checkTokenMiddleware(),
        serviceLoggerMiddleware(logger, 'groupService.deleteById'),
        async (req: Request, res: Response, next: NextFunction) => {
            const foundGroup = req.body.group;
            if (!foundGroup) {
                res.status(404).json(getNotFoundGroupResponse(req.params.id));
            } else {
                try {
                    await groupService.deleteById(req.params.id);
                    res.status(204).send();
                } catch (error) {
                    next(error);
                }
            }
        },
        unhandledErrorLoggerMiddleware(logger)
    );

    router.put('/groups',
        cors(corsOptions),
        checkTokenMiddleware(),
        validationMiddleware(schema),
        serviceLoggerMiddleware(logger, 'groupService.createGroup'),
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                await groupService.createGroup(req.body.name, req.body.permissions);
                res.status(204).json('Group created');
            } catch (error) {
                next(error);
            }
        },
        unhandledErrorLoggerMiddleware(logger)
    );

    router.post('/groups/:id',
        cors(corsOptions),
        checkTokenMiddleware(),
        validationMiddleware(schema),
        serviceLoggerMiddleware(logger, 'groupService.changeGroup'),
        async (req: Request, res: Response, next: NextFunction) => {
            const foundGroup = req.body.group;

            if (!foundGroup) {
                res.status(404).json(getNotFoundGroupResponse(req.params.id));
            } else {
                const name = req.body.name || foundGroup.name;
                const permissions = req.body.permissions || foundGroup.permissions;
                try {
                    await groupService.changeGroup(req.params.id, name, permissions);
                    res.status(204).json();
                } catch (error) {
                    next(error);
                }
            }
        },
        unhandledErrorLoggerMiddleware(logger)
    );

    router.get('/groups/:id',
        cors(corsOptions),
        checkTokenMiddleware(),
        serviceLoggerMiddleware(logger, 'groupService.findById'),
        (req: Request, res: Response) => {
            const foundGroup = req.body.group;

            if (!foundGroup) {
                res.status(404).json(getNotFoundGroupResponse(req.params.id));
            } else {
                res.json(foundGroup);
            }
        }
    );

    router.get('/groups',
        cors(corsOptions),
        checkTokenMiddleware(),
        serviceLoggerMiddleware(logger, 'groupService.getAll'),
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const foundGroups = await groupService.getAll();
                res.json(foundGroups);
            } catch (error) {
                next(error);
            }
        },
        unhandledErrorLoggerMiddleware(logger)
    );

    const getNotFoundGroupResponse = (id: string) => {
        return {
            message: `Group with id: ${id}, not found`
        };
    };
    return router;
};
