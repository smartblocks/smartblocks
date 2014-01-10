var path = require('path');
var fs = require('fs');

var smartblocks = {
    getBlocks: function () {
        var blocks_folders = fs.readdirSync(path.join(__dirname, '..', 'blocks'));
        return blocks_folders;
    },
    getBlocksModels: function () {
        var blocks_folders = fs.readdirSync(path.join(__dirname, '..', 'blocks'));

        var models = [];
        for (var k in blocks_folders) {
            var descriptor = require('../blocks/' + blocks_folders + '/descriptor');
            if (descriptor) {
                models.push(descriptor);
            }
        }
        return models;
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
