import {Group} from '../data-access/DataBase.js';

export class GroupModel {

    async deleteById(id: string) {
        return await Group.destroy({
            where: {
                id
            }
        });
    }

    async findById(id: string) {
        return await Group.findAndCountAll({
            where: {
                id
            }
        });
    }

    async create(name: string, permissions: string) {
        return await Group.create({
            name,
            permissions
        });
    }

    async change(id: string, name: string, permissions: string) {
        return await Group.update({
            name,
            permissions
        }, {
            where: {
                id
            }
        });
    }

    async getAll() {
        return await Group.findAll();
    }
}

