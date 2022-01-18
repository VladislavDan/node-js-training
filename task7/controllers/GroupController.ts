import {GroupService} from '../services/GroupService.js';
import {NextFunction, Request, Response} from 'express';

export class GroupController {
    constructor(private groupService: GroupService) {

    }

    findGroupById = async (req: Request, res: Response, next: NextFunction, id: string) => {
        req.body.group = await this.groupService.findById(id);
        next();
    };

    deleteGroupById = async (req: Request, res: Response, next: NextFunction) => {
        const foundGroup = req.body.group;
        if (!foundGroup) {
            res.status(404).json(this.getNotFoundGroupResponse(req.params.id));
        } else {
            try {
                await this.groupService.deleteById(req.params.id);
                res.status(204).send();
            } catch (error) {
                next(error);
            }
        }
    };

    changeGroup = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.groupService.createGroup(req.body.name, req.body.permissions);
            res.status(204).json('Group created');
        } catch (error) {
            next(error);
        }
    };

    createNewGroup = async (req: Request, res: Response, next: NextFunction) => {
        const foundGroup = req.body.group;

        if (!foundGroup) {
            res.status(404).json(this.getNotFoundGroupResponse(req.params.id));
        } else {
            const name = req.body.name || foundGroup.name;
            const permissions = req.body.permissions || foundGroup.permissions;
            try {
                await this.groupService.changeGroup(req.params.id, name, permissions);
                res.status(204).json();
            } catch (error) {
                next(error);
            }
        }
    };

    getGroupById = (req: Request, res: Response) => {
        const foundGroup = req.body.group;

        if (!foundGroup) {
            res.status(404).json(this.getNotFoundGroupResponse(req.params.id));
        } else {
            res.json(foundGroup);
        }
    };

    getAllGroups = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const foundGroups = await this.groupService.getAll();
            res.json(foundGroups);
        } catch (error) {
            next(error);
        }
    };

    getNotFoundGroupResponse = (id: string) => {
        return {
            message: `Group with id: ${id}, not found`
        };
    };
}
