import {UserGroup} from '../data-access/DataBase.js';

export class UserGroupModel {

    async addUsersToGroup(userid: number, groupid: number) {
        return await UserGroup.create({
            userid,
            groupid
        });
    }

    async getAll() {
        return await UserGroup.findAll();
    }
}

