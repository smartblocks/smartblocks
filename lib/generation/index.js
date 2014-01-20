var type_generation = require('./type');
var block_generation = require('./block');
var app_generation = require('./app');
var controller_generation = require('./controller');
var model_generation = require('./model');
var view_generation = require('./view');

module.exports = {
    generateType: function () {
        type_generation.run();
    },
    generateBlock: function () {
        block_generation.run();
    },
    generateApp: function () {
        app_generation.run();
    },
    generateController: function () {
        controller_generation.run();
    },
    generateModel: function () {
        model_generation.run();
    },
    generateView: function () {
        view_generation.run();
    }
};