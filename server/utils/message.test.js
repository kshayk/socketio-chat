var expect = require('expect');

var {generateMessage} = require('./message');

describe('generateMessage', () => {
    it('Should generate the correct message object', () => {
        var res = generateMessage('shay', 'test message');

        expect(typeof res.createdAt).toBe('number');
        expect(res.from).toBe('shay');
        expect(res.text).toBe('test message');
    });
});