import {UserModel} from '../models/UserModel';

export class UserService {

    constructor(private userModel: UserModel) {

    }

    async deleteById(id: string) {
        await this.userModel.deleteById(id);
        return id;
    }

    async findById(id: string) {
        return await this.userModel.findById(id);
    }

    async createUser(login: string, password: string, age: number, isDeleted: boolean) {
        return await this.userModel.createUser(login, password, age, isDeleted)
    }

    async changeUser(id: string, login: string, password: string, age: number, isDeleted: boolean) {
        return await this.userModel.changeUser(id, login, password, age, isDeleted)
    }

    async findByName(name:string, limit: number) {
        return await this.userModel.findByName(name, limit)
    }
}
