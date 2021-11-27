import express, {NextFunction, Request, Response} from 'express';
import {validationMiddleware} from '../common/validationMiddleware.js';
import Joi from 'joi';
import {GroupService} from '../services/GroupService';

export const GroupRouter = (groupService: GroupService) => {
    const schema = Joi.object().keys({
        name: Joi.string().required(),
        permissions: Joi.array().required()
    });
    const router = express.Router();
    router.param('id', async (req: Request, res: Response, next: NextFunction, id: string) => {
        req.body.group = await groupService.findById(id);
        next();
    });
    router.delete('/groups/:id', async (req: Request, res: Response) => {
        const foundGroup = req.body.group;
        if (!foundGroup) {
            res.status(404).json(getNotFoundGroupResponse(req.params.id));
        } else {
            await groupService.deleteById(req.params.id);
            res.status(204).send();
        }
    });

    router.put('/groups', validationMiddleware(schema), async (req: Request, res: Response) => {
        await groupService.createGroup(req.body.name, req.body.permissions);
        res.status(204).json('Group created');
    });

    router.post('/groups/:id', validationMiddleware(schema), async (req: Request, res: Response) => {
        const foundGroup = req.body.group;

        if (!foundGroup) {
            res.status(404).json(getNotFoundGroupResponse(req.params.id));
        } else {
            const name = req.body.name || foundGroup.name;
            const permissions = req.body.permissions || foundGroup.permissions;
            await groupService.changeGroup(req.params.id, name, permissions);
            res.status(204).json();
        }
    });

    router.get('/groups/:id', (req: Request, res: Response) => {
        const foundGroup = req.body.group;

        if (!foundGroup) {
            res.status(404).json(getNotFoundGroupResponse(req.params.id));
        } else {
            res.json(foundGroup);
        }
    });

    router.get('/groups', async (req: Request, res: Response) => {
        const foundGroups = await groupService.getAll();

        res.json(foundGroups);
    });

    const getNotFoundGroupResponse = (id: string) => {
        return {
            message: `Group with id: ${id}, not found`
        };
    };
    return router;
};
