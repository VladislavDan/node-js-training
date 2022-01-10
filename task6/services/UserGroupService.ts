import {UserGroupModel} from '../models/UserGroupModel.js';

export class UserGroupService {

    constructor(private userGroupModel: UserGroupModel) {

    }

    async getAll() {
        return await this.userGroupModel.getAll()
    }

    async addUsersToGroup(userIds: number[], groupId: number) {

        const results = [];
        for (const userId of userIds) {
            await this.userGroupModel.addUsersToGroup(userId, groupId).then((result) => {
                results.push(result)
            }).catch((error)=> {
                results.push(error)
            });
        }
    }
}
