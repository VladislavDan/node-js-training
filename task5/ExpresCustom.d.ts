import {IUser} from './types/IUser';
import {IGroup} from './types/IGroup';

declare namespace Express {
    export interface Request {
        user: IUser | undefined;
        group: IGroup | undefined;
    }
}
