var path = require('path');
var fs = require('fs');
var ncp = require('ncp').ncp;

var smartblocks = {
    getBlocks: function () {
        var blocks_folders = fs.readdirSync(path.join(process.cwd(), 'blocks'));
        return blocks_folders;
    },
    getBlocksModels: function () {
        var blocks_folders = fs.readdirSync(path.join(process.cwd(), 'blocks'));

        var models = [];
        for (var k in blocks_folders) {
            var block_descriptor_path = process.cwd() + '/blocks/' + blocks_folders[k] + '/descriptor';
            (function (block_descriptor_path) {
                var descriptor = require(block_descriptor_path);
                if (descriptor) {
                    models.push(descriptor);
                }
            })(block_descriptor_path);
        }
        return models;
    },
    getApplications: function (blockname) {
        var base = this;
        var blocks = base.getBlocks();
        var apps = [];

        if (blocks.indexOf(blockname) != -1) {
            var descriptor = require(process.cwd() + '/blocks/' + blockname + '/descriptor');
            for (var k in descriptor.apps) {
                descriptor.apps[k].block_token = blockname;
            }
            return descriptor.apps;
        } else {
            return [];
        }
    },
    cli: function (directory) {
        var cwd = directory || process.cwd();
        return {
            createProjectStructure: function (name) {
                var cwd = process.cwd();
                var apppath = path.join(cwd, name);
                fs.mkdir(apppath, function () {
                    ncp(path.join(__dirname, 'project_structure', 'blocks'), path.join(apppath, 'blocks'));
                    fs.mkdir(path.join(apppath, 'config'), function () {
                        fs.readFile(path.join(__dirname, 'project_structure', 'config', 'index.std.js'), {}, function (err, data) {
                            fs.writeFile(path.join(apppath, 'config', 'index.js'), data, {}, function (err) {
                                if (err) console.error("An error occured while creating the config file");
                            });
                        });
                    });
                    fs.readFile(path.join(__dirname, 'project_structure', 'package.std.json'), {}, function (err, data) {
                        fs.writeFile(path.join(apppath, 'package.json'), data, {}, function (err) {
                            if (err) console.error("An error occured while creating the config file");
                        });
                    });
                });
            },
            createBlockStructure: function (name) {
                var cwd = process.cwd();
            }
        }
    }
};
module.exports = smartblocks;
