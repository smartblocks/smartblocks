var config = require('../../config'),  crypto = require("crypto");

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
    insert: function(data, callback) {
        data.ID = crypto.randomBytes(20).toString('hex');
        this.collection().insert(data, {}, callback || function(){ });
    },
    update: function(data, callback) {
        this.collection().update({ID: data.ID}, data, {}, callback || function(){ });
    },
    getlist: function(callback, query) {
        this.collection().find(query || {}).toArray(callback);
    },
    remove: function(ID, callback) {
        this.collection().findAndModify({ID: ID}, [], {}, {remove: true}, callback);
    },
    collection: function () {
        if (this._collection) return this._collection;
        return this._collection = this.db.collection(this.collection_name);
    }
};