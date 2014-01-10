var BaseModel = require('./Base'),
    crypto = require("crypto"), model = new BaseModel();;

module.exports = model.extend({
    collection_name: 'users'
});