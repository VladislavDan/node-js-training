import {GroupController} from './GroupController';


describe('GroupController', () => {
    const groups = ['group1', 'group2'];
    let groupController;
    let status;
    let next;
    let request;
    let json;
    let groupServiceStub;

    beforeEach(() => {

        groupServiceStub = {

            deleteById: () => Promise.resolve('groupName'),

            findById: () => Promise.resolve('groupName'),

            createGroup: () => Promise.resolve(),

            changeGroup: () => Promise.resolve(),

            getAll: () => Promise.resolve(groups)
        };
        groupController = new GroupController(groupServiceStub);

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
            body: {
                group: 'groupName'
            },
            params: {
                id: 2
            }
        };
    });

    it('findGroupById, should find group and write it in body', async () => {
        request = {
            body: {
                group: ''
            }
        };
        await groupController.findGroupById(request, null, () => {}, null);
        expect(request.body.group).toEqual('groupName');
    });

    it('deleteGroupById, should send status 204 if found group', async () => {
        const response = {
            status
        };
        await groupController.deleteGroupById(request, response, () => {}, null);
        expect(status).toHaveBeenCalledWith(204);
    });

    it('deleteGroupById, should send status 404 if not found group', async () => {
        request = {
            body: {
                group: null
            },
            params: {
                id: 2
            }
        };
        const response = {
            status
        };
        await groupController.deleteGroupById(request, response, () => {}, null);
        expect(status).toHaveBeenCalledWith(404);
    });

    it('deleteGroupById, should send error if group deleted with error', async () => {
        const error = "error";
        groupServiceStub.deleteById = () => Promise.reject(error);
        await groupController.deleteGroupById(request, null, next, null);
        expect(next).toHaveBeenCalledWith(error);
    });

    it('createNewGroup, should send status 204 if group created with success', async () => {
        const response = {
            status
        };
        await groupController.createNewGroup(request, response, () => {}, null);
        expect(status).toHaveBeenCalledWith(204);
    });

    it('createNewGroup, should send error if group created with error', async () => {
        const error = "error";
        groupServiceStub.createGroup = () => Promise.reject(error);
        await groupController.createNewGroup(request, null, next, null);
        expect(next).toHaveBeenCalledWith(error);
    });

    it('changeGroup, should send status 204 if group changed with success', async () => {
        const response = {
            status
        };
        await groupController.changeGroup(request, response, () => {}, null);
        expect(status).toHaveBeenCalledWith(204);
    });

    it('changeGroup, should send status 404 if not found group', async () => {
        request = {
            body: {
                group: null
            },
            params: {
                id: 2
            }
        };
        const response = {
            status
        };
        await groupController.changeGroup(request, response, () => {}, null);
        expect(status).toHaveBeenCalledWith(404);
    });

    it('changeGroup, should send error if group changed with error', async () => {
        const error = "error";
        groupServiceStub.changeGroup = () => Promise.reject(error);
        await groupController.changeGroup(request, null, next, null);
        expect(next).toHaveBeenCalledWith(error);
    });

    it('getGroupById, should send status 404 if not found group', async () => {
        request = {
            body: {
                group: null
            },
            params: {
                id: 2
            }
        };
        const response = {
            status
        };
        await groupController.changeGroup(request, response, () => {}, null);
        expect(status).toHaveBeenCalledWith(404);
    });

    it('getGroupById, should send group if found group', async () => {
        request = {
            body: {
                group: 'group'
            },
            params: {
                id: 2
            }
        };
        const response = {
            json
        };
        await groupController.getGroupById(request, response, () => {}, null);
        expect(json).toHaveBeenCalledWith(request.body.group);
    });

    it('getAllGroups, should send groups array', async () => {
        const response = {
            json
        };
        await groupController.getAllGroups(request, response, () => {}, null);
        expect(json).toHaveBeenCalledWith(groups);
    });
});
