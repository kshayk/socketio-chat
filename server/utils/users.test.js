const expect = require('expect');

var {Users} = require('./users');

describe('Users', () => {
    var users;

    beforeEach(() => {
        users = new Users();

        users.users = [{
            id: 1,
            name: 'shay',
            room: 'test room'
        },{
            id: 2,
            name: 'shay2',
            room: 'test room 2'
        },{
            id: 3,
            name: 'shay3',
            room: 'test room'
        }]
    });

    it('Should add new user', () => {
        var users = new Users();
        var user = {
            id: 123,
            name: 'shay',
            room: 'test room'
        };

        var newUserRes = users.addUser(user.id, user.name, user.room);

        expect(users.users).toEqual([user]);

    });

    it('Should return names for test room', () => {
        var userList = users.getUserList('test room');

        expect(userList).toEqual(['shay', 'shay3']);
    });

    it('Should return names for test room 2', () => {
        var userList = users.getUserList('test room 2');

        expect(userList).toEqual(['shay2']);
    });

    it('Should find a user', () => {
        var userId = 2;
        var user = users.getUser(userId);

        expect(user.id).toBe(userId);
    });

    it('Should not find a user', () => {
        var userId = 99;
        var user = users.getUser(userId);

        expect(typeof user).toBe('undefined');
    });

    it('Should remove a user', () => {
        var userId = 1;

        var user = users.removeUser(userId);

        expect(user.id).toBe(userId);
        expect(users.users.length).toBe(2);
    });

    it('Should not remove a user', () => {
        var userId = 99;

        var user = users.removeUser(userId);

        expect(typeof user).toBe('undefined');
    })
});