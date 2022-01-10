import {UserModel} from '../models/UserModel.js';

export class AuthenticateService {

    constructor(private userModel: UserModel) {

    }

    async checkUser(name:string, password: string, limit: number) {
        const users = await this.userModel.findByName(name, limit);
        const results = users.rows.findIndex((user) => {
            return user.getDataValue('password') === password;
        });
        if(results >= 0) {
            return true;
        }
        return false;
    }
}
