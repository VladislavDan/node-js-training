import {IUser} from './types/IUser';

declare namespace Express {
    export interface Request {
        user: IUser | undefined
    }
}
