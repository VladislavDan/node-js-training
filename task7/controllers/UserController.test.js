import {UserController} from './UserController';


describe('UserController', () => {
    const users = ['user1', 'user2'];
    let userController;
    let status;
    let next;
    let request;
    let json;
    let userServiceStub;

    beforeEach(() => {

        userServiceStub = {

            deleteById: () => Promise.resolve('userName'),

            findById: () => Promise.resolve('userName'),

            createUser: () => Promise.resolve(),

            changeUser: () => Promise.resolve(),

            findByName: () => Promise.resolve(users)
        };
        userController = new UserController(userServiceStub);

        status = jest.fn(code => {
            return {
                json: () => code
            };
        });
        next = jest.fn(error => {
            return error;
        });
        json = jest.fn(result => {
            return result;
        });
        request = {
            user: 'userName',
            body: {
                login: 'user',
                password: 'password',
                age: 23
            },
            params: {
                id: 2
            }
        };
    });

    it('findByUser, should find user and write it in body', async () => {
        request = {
            user: ''
        };
        await userController.findByUser(request, null, () => {
        }, null);
        expect(request.user).toEqual('userName');
    });

    it('deleteById, should send status 204 if found user', async () => {
        const response = {
            status
        };
        await userController.deleteById(request, response, () => {
        }, null);
        expect(status).toHaveBeenCalledWith(204);
    });

    it('deleteById, should send status 404 if not found user', async () => {
        request = {
            body: {
                user: null
            },
            params: {
                id: 2
            }
        };
        const response = {
            status
        };
        await userController.deleteById(request, response, () => {
        }, null);
        expect(status).toHaveBeenCalledWith(404);
    });

    it('deleteById, should send error if user deleted with error', async () => {
        const error = "error";
        userServiceStub.deleteById = () => Promise.reject(error);
        await userController.deleteById(request, null, next, null);
        expect(next).toHaveBeenCalledWith(error);
    });

    it('createUser, should send status 204 if user created with success', async () => {
        const response = {
            status
        };
        await userController.createUser(request, response, () => {
        }, null);
        expect(status).toHaveBeenCalledWith(204);
    });

    it('createUser, should send error if user created with error', async () => {
        const error = "error";
        userServiceStub.createUser = () => Promise.reject(error);
        await userController.createUser(request, null, next, null);
        expect(next).toHaveBeenCalledWith(error);
    });

    it('changeUser, should send status 204 if user changed with success', async () => {
        const response = {
            status
        };
        await userController.changeUser(request, response, () => {
        }, null);
        expect(status).toHaveBeenCalledWith(204);
    });

    it('changeUser, should send status 404 if not found user', async () => {
        request = {
            body: {
                user: null
            },
            params: {
                id: 2
            }
        };
        const response = {
            status
        };
        await userController.changeUser(request, response, () => {
        }, null);
        expect(status).toHaveBeenCalledWith(404);
    });

    it('changeUser, should send error if user changed with error', async () => {
        const error = "error";
        userServiceStub.changeUser = () => Promise.reject(error);
        await userController.changeUser(request, null, next, null);
        expect(next).toHaveBeenCalledWith(error);
    });

    it('getUserById, should send status 404 if not found user', async () => {
        request = {
            body: {
                user: null
            },
            params: {
                id: 2
            }
        };
        const response = {
            status
        };
        await userController.getUserById(request, response, () => {
        }, null);
        expect(status).toHaveBeenCalledWith(404);
    });

    it('getUserById, should send user if found user', async () => {
        request = {
            user: 'user',
            params: {
                id: 2
            }
        };
        const response = {
            json
        };
        await userController.getUserById(request, response, () => {
        }, null);
        expect(json).toHaveBeenCalledWith(request.user);
    });

    it('getAllUsers, should send user array', async () => {
        request = {
            query: {
                loginSubstring: ''
            }
        };
        const response = {
            json
        };
        await userController.getAllUsers(request, response, () => {
        }, null);
        expect(json).toHaveBeenCalledWith(users);
    });
});
