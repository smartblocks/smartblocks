var SmartBlocks = require('../smartblocks');

module.exports = {
    index: function (req, res) {
        SmartBlocks.getBlocksModels(function (blocks) {
            var response = [];
            for (var k in blocks) {
                var block = blocks[k];
                if (block.restricted_to) {
                    var add = false;
                    for (var j in block.restricted_to) {
                        if (req.session.rights && req.session.rights.indexOf(block.restricted_to[j]) !== -1) {
                            add = true;
                        }
                    }
                    if (add) {
                        response.push(block);
                    }
                } else {
                    response.push(block);
                }
            }

            res.json(response);
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