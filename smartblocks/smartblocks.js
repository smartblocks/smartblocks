var path = require('path');
var fs = require('fs');

var smartblocks = {
    getBlocks: function () {
        var blocks_folders = fs.readdirSync(path.join(__dirname, '..', 'blocks'));
        return blocks_folders;
    },
    getApplications: function (blockname) {
        var base = this;
        var blocks = base.getBlocks();
        var apps = [];

        if (blocks.indexOf(blockname) != -1) {
            var descriptor = require('../blocks/' + blockname + '/descriptor');
            for (var k in descriptor.apps) {
                descriptor.apps[k].block_token = blockname;
            }
            return descriptor.apps;
        } else {
            return [];
        }
    }
};
module.exports = smartblocks;
