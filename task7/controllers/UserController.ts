import {UserService} from '../services/UserService.js';
import {NextFunction, Request, Response} from 'express';

export class UserController {
    constructor(private userService: UserService) {
    }

    findByUser = async (req: Request, res: Response, next: NextFunction, id: string) => {
        req.user = await this.userService.findById(id);
        next();
    };

    deleteById = async (req: Request, res: Response, next: NextFunction) => {
        const foundUser = req.user;
        if (!foundUser) {
            res.status(404).json(this.getNotFoundUserResponse(req.params.id));
        } else {
            try {
                await this.userService.deleteById(req.params.id);
                res.status(204).send();
            } catch (error) {
                next(error);
            }
        }
    };

    createUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.userService.createUser(req.body.login, req.body.password, req.body.age, false);
            res.status(204).json('User created');
        } catch (error) {
            next(error);
        }
    };

    changeUser = async (req: Request, res: Response, next: NextFunction) => {
        const foundUser = req.user;

        if (!foundUser) {
            res.status(404).json(this.getNotFoundUserResponse(req.params.id));
        } else {
            const login = req.body.login || foundUser.login;
            const password = req.body.password || foundUser.password;
            const age = req.body.age || foundUser.age;
            try {
                await this.userService.changeUser(req.params.id, login, password, age, foundUser.isDeleted);
                res.status(204).json();
            } catch (error) {
                next(error);
            }
        }
    };

    getUserById = (req: Request, res: Response) => {
        const foundUser = req.user;

        if (!foundUser) {
            res.status(404).json(this.getNotFoundUserResponse(req.params.id));
        } else {
            res.json(foundUser);
        }
    };

    getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
        const loginSubstring = req.query.loginSubstring ? req.query.loginSubstring.toString() : '';
        const limit = Number(req.query.limit);
        try {
            const foundUsers = await this.userService.findByName(loginSubstring, limit);
            res.json(foundUsers);
        } catch (error) {
            next(error);
        }
    };

    getNotFoundUserResponse = (id: string) => {
        return {
            message: `Employee with id: ${id}, not found`
        };
    };
}
