var mongoose = require('mongoose');

var dbdriver_mongoose = {
    connect: function (config) {
        mongoose.connect(config.database.connection_str + '/' + config.database.name);
        var db = mongoose.connection;
        return db;
    }
}

module.exports = dbdriver_mongoose;