import {NextFunction, Request, Response} from 'express';
import {Logger} from 'winston';

export const unhandledErrorLoggerMiddleware = (logger: Logger) => {
    return (err: Error, req: Request, res: Response, next: NextFunction): void => {
        if (err) {
            if (res.headersSent) {
                return next(err);
            }
            logger.log({
                level: 'error',
                message: `Error: ${JSON.stringify(err)}`
            });
            res.status(500);
        } else {
            next();
        }
    };
};
