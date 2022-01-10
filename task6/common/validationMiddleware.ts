import {ObjectSchema, ValidationErrorItem} from 'joi';
import {NextFunction, Request, Response} from 'express';
import {IErrorResponse} from '../types/IErrorResponse';

const errorResponse = (schemaErrors: ValidationErrorItem[]): IErrorResponse => {
    const errors = schemaErrors.map((error) => {
        const { path, message } = error;
        return { path, message };
    });
    return {
        status: 'failed',
        errors
    };
};

export const validationMiddleware = (schema: ObjectSchema<any>) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const {error} = schema.validate(req.body, {
            abortEarly: false,
            allowUnknown: true
        });

        if (error && error.isJoi) {
            res.status(400).json(errorResponse(error.details));
        } else {
            next();
        }
    };
};
