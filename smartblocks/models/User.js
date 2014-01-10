var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    email: {type: String, index: {unique: true}},
    password: String
});

module.exports = mongoose.model('User', userSchema);