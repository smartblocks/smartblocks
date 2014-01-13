var SmartBlocks = require('../smartblocks');

module.exports = {
    index: function (req, res) {
        var blocks = SmartBlocks.getBlocks();
        var apps = [];
        for (var k in blocks) {
            var block = blocks[k];
            var block_apps = SmartBlocks.getApplications(block);
            for (var i in block_apps) {
                apps.push(block_apps[i]);
            }
        }
        res.json(apps);
    }
};