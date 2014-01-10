var SmartBlocks = require('../smartblocks');

module.exports = {
    index: function (req, res) {
        var blocks = SmartBlocks.getBlocks();
        res.json(blocks);
    }
};