describe('MongoDB', function () {
    it('is there a server running', function (next) {
        var MongoClient = require('mongodb').MongoClient;
        var config = require('../config')('tests');
        MongoClient.connect(config.database.connection_str + '/' + config.database.name, function (err, db) {
            expect(err).toBe(null);
            next();
        });
    });
});