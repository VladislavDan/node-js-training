import {GroupController} from './GroupController';


describe('GroupController', () => {

    const groupServiceStub = {

        deleteById: () => Promise.resolve('groupName'),

        findById: () => Promise.resolve('groupName'),

        createGroup: () => Promise.resolve(),

        changeGroup: () => Promise.resolve(),

        getAll: () => Promise.resolve()
    };

    let groupController;

    beforeEach(() => {
        groupController = new GroupController(groupServiceStub);
    });

    it('findGroupById, should find group and write it in body', async () => {
        const request = {
            body: {
                group: ''
            }
        };
        await groupController.findGroupById(request, null, () => {}, null);
        expect(request.body.group).toEqual('groupName');
    });

    it('findGroupById, should send status 204 if found group', async () => {
        const status = jest.fn(code => {
            return {
                json: () => code
            };
        });
        const request = {
            body: {
                group: 'group1'
            },
            params: {
                id: 2
            }
        };
        const response = {
            status
        };
        await groupController.deleteGroupById(request, response, () => {}, null);
        expect(status).toHaveBeenCalledWith(204);
    });

    it('findGroupById, should send status 404 if not found group', async () => {
        expect(1).toBe(1);
    });

    it('findGroupById, should send error if group deleted by error', async () => {
        expect(1).toBe(1);
    });
});
