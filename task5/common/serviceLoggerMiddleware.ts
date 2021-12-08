import {NextFunction, Request, Response} from 'express';
import {Logger} from 'winston';

export const serviceLoggerMiddleware = (logger: Logger, serviceMethod: string) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const params = (req.params && req.params.id) || 'null';
        const body = JSON.stringify(req.body);
        const query = JSON.stringify(req.query);
        logger.log({
            level: 'info',
            message: `Method: ${serviceMethod} Params: ${params} Query: ${query} Body: ${body}`
        });

        next();
    };
};
