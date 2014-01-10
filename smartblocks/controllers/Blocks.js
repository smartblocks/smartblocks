var SmartBlocks = require('../smartblocks');

module.exports = {
    index: function (req, res) {
        var blocks = SmartBlocks.getBlocksModels();
        res.json(blocks);
    },
    style_list: function (req, res) {
        var blocks = SmartBlocks.getBlocks();
        console.log("JAHA");
        var response = '@import "/main.less";';

        for (var k in blocks) {
            response += '\n@import "/' + blocks[k] + '/index.less";';
        }
        res.setHeader('content-type', 'text/css');
        res.send(200, response);
    }
};