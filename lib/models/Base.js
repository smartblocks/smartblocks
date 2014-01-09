var config = require('../../config');

module.exports = function (db) {
    this.db = db;
};

module.exports.prototype = {
    extend: function (properties) {
        var Child = module.exports;
        Child.prototype = module.exports.prototype;
        for (var k in properties) {
            Child.prototype[k] = properties[k];
        }
        return Child;
    },
    setDB: function (db) {
        this.db = db;
    },
    collection: function () {
        if (this._collection) return this._collection;
        return this._collection = this.db.collection(config.database.name + '-content');
    }
};