var SmartBlocks = require('../smartblocks');

module.exports = {
    index: function (req, res) {
        var blocks = SmartBlocks.getBlocksModels();
//        var response = [];
//        for (var k in blocks) {
//            var block = {
//                name: blocks[k]
//            };
//            response.push(block);
//        }

        res.json(blocks);
    }
};