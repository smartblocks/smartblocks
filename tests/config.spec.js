describe("Configuration setup", function () {
    it("should load local configurations", function (next) {
        var config = require('../config')('local');
        expect(config.mode).toBe('local');
        next();
    });
    it("should load staging configurations", function (next) {
        var config = require('../config')('staging');
        expect(config.mode).toBe('staging');
        next();
    });
    it("should load production configurations", function (next) {
        var config = require('../config')('production');
        expect(config.mode).toBe('production');
        next();
    });
    it("should load test configurations", function (next) {
        var config = require('../config')('tests');
        expect(config.mode).toBe('tests');
        next();
    });
});