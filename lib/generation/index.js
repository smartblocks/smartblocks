var type_generation = require('./type');
var block_generation = require('./block');

module.exports = {
    generateType: function () {
        type_generation.run();
    },
    generateBlock: function () {
        block_generation.run();
    }
};