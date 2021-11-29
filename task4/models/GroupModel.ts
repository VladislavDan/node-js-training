import {Group, UserGroup} from '../data-access/DataBase.js';

export class GroupModel {

    deleteById(id: string) {
        return UserGroup.destroy({
            where: {
                groupid: id
            }
        }).then(() => Group.destroy({
            where: {
                id
            }
        }));
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

