import sequelize from 'sequelize';
import {DataBase} from '../data-access/DataBase.js';
const { DataTypes, Op, Sequelize } = sequelize;

const User = DataBase().define('user', {
    login: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    isdeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    timestamps: false
});

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
                    [Op.substring]: name
                }
            },
            limit
        });
    }
}

