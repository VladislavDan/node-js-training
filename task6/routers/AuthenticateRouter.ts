import express, {NextFunction, Response} from 'express';
import {validationMiddleware} from '../common/validationMiddleware.js';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import {AuthenticateService} from '../services/AuthenticateService.js';
import {SECRET} from '../common/Constants.js';

export const AuthenticateRouter = (authenticateService: AuthenticateService) => {
    const schema = Joi.object().keys({
        login: Joi.string().required(),
        password: Joi.string().regex(/^[a-zA-Z0-9]+$/i).min(8).required()
    });
    const router = express.Router();

    router.post('/authenticate',
        validationMiddleware(schema),
        async (req: any, res: Response, next: NextFunction) => {

            const isExist = await authenticateService.checkUser(req.body.login, req.body.password, 100);

            if (!isExist) {
                res.status(401).json('Bad user name/password combination');
                return next('Error authorization');
            }

            const payload = {sub: req.body.login, title: req.body.password};
            const token = jwt.sign(payload, SECRET, {expiresIn: 200});
            res.send(token);
        }
    );
    return router;
};
