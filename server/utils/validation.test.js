const expect = require('expect');

const {isRealString} = require('./validation');

describe('isRealString', () => {
    it('should return true for real string', () => {
        var res = isRealString('this is a real string');

        expect(res).toBeTruthy();
    });

    it('should return false for not a string', () => {
        var res = isRealString('    ');

        expect(res).toBeFalsy();
    });

    it('should allow string with no space', () => {
        var res = isRealString('teststring123');

        expect(res).toBeTruthy();
    });
});