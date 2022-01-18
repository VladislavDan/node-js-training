import {NextFunction, Request, Response} from 'express';
import jwt, {VerifyErrors} from 'jsonwebtoken';
import {SECRET} from './Constants.js';

export const checkTokenMiddleware = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        console.log(req.headers['x-access-token'])
        const token: any = req.headers['x-access-token'];
        if (!token) {
            return res.status(401).send({success: false, message: 'Not token provided'});
        }

        return jwt.verify(token, SECRET, (err: VerifyErrors | null) => {
            if (err) {
                return res.status(401).send({success: false, message: 'Failed to authenticate token'});
            }
            return next();
        });
    };
};
