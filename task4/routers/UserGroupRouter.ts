import express, {Request, Response} from 'express';
import {validationMiddleware} from '../common/validationMiddleware.js';
import Joi from 'joi';
import {UserGroupService} from '../services/UserGroupService.js';

export const UserGroupRouter = (userGroupService: UserGroupService) => {
    const schema = Joi.object().keys({
        userIds: Joi.array().required(),
        groupId: Joi.number().required()
    });
    const router = express.Router();

    router.put('/user-group', validationMiddleware(schema), async (req: Request, res: Response) => {
        await userGroupService.addUsersToGroup(req.body.userIds, req.body.groupId);
        res.status(204).json('Users added to group');
    });

    router.get('/user-group', async (req: Request, res: Response) => {
        const foundGroups = await userGroupService.getAll();

        res.json(foundGroups);
    });
    return router;
};
