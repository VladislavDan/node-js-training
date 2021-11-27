import {GroupModel} from '../models/GroupModel';

export class GroupService {

    constructor(private groupModel: GroupModel) {

    }

    async deleteById(id: string) {
        await this.groupModel.deleteById(id);
        return id;
    }

    async findById(id: string) {
        return await this.groupModel.findById(id);
    }

    async createGroup(name: string, permissions: string) {
        return await this.groupModel.create(name, permissions)
    }

    async changeGroup(id: string, name: string, permissions: string) {
        return await this.groupModel.change(id, name, permissions)
    }

    async getAll() {
        return await this.groupModel.getAll()
    }
}
