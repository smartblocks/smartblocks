var type_generation = require('./type');
var block_generation = require('./block');
var app_generation = require('./app');

module.exports = {
    generateType: function () {
        type_generation.run();
    },
    generateBlock: function () {
        block_generation.run();
    },
    generateApp: function () {
        app_generation.run();
    }
};