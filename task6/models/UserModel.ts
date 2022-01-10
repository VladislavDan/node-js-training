import {User} from '../data-access/DataBase.js';
import sequelize from 'sequelize';

export class UserModel {

    async deleteById(id: string) {
        return await User.update({ isdeleted: true }, {
            where: {
                id
            }
        });
    }

    async findById(id: string) {
        return await User.findAndCountAll({
            where: {
                id
            }
        });
    }

    async createUser(login: string, password: string, age: number, isdeleted: boolean) {
        return await User.create({
            login,
            password,
            age,
            isdeleted
        });
    }

    async changeUser(id: string, login: string, password: string, age: number, isdeleted: boolean) {
        return await User.update({
            login,
            password,
            age,
            isdeleted
        }, {
            where: {
                id
            }
        });
    }

    async findByName(name:string, limit: number) {
        return await User.findAndCountAll({
            where: {
                login: {
                    [sequelize.Op.substring]: name
                }
            },
            limit
        });
    }

    async getAll() {
        return await User.findAll();
    }
}

