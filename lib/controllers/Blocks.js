var SmartBlocks = require('../smartblocks');

module.exports = {
    index: function (req, res) {
        SmartBlocks.getBlocksModels(function (blocks) {
            var response = [];
            for (var k in blocks) {
                var block = blocks[k];

            }

            res.json(blocks);
        });

    },
    style_list: function (req, res) {
        var blocks = SmartBlocks.getBlocks();
        var response = '@import "/main.less";';

        for (var k in blocks) {
            response += '\n@import "/' + blocks[k] + '/index.less";';
        }
        res.setHeader('content-type', 'text/css');
        res.send(200, response);
    }
};