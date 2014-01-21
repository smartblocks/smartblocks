var path = require('path');
var fs = require('fs');
var ncp = require('ncp').ncp;
var Handlebars = require('handlebars');
var async = require('async');
var os = require('os');
var smartblocks = {
    getBlocks: function () {
        var blocks_folders = fs.readdirSync(path.join(process.cwd(), 'blocks'));
        return blocks_folders;
    },
    getBlocksModels: function (callback) {
        var blocks_folders = fs.readdirSync(path.join(process.cwd(), 'blocks'));
        var models = [];
        async.each(blocks_folders, function (block_name, next) {
            var block_descriptor_path = path.join(process.cwd(), '/blocks/', block_name, '/descriptor.json');
            (function (block_descriptor_path) {
                fs.readFile(block_descriptor_path, 'UTF-8', function (err, data) {
                    var descriptor = JSON.parse(data);
                    if (descriptor) {
                        models.push(descriptor);
                    }
                    next();
                });
            })(block_descriptor_path);
        }, function () {
            callback(models);
        });
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
                        fs.readFile(path.join(__dirname, 'project_structure', 'config', 'index.std.js'), 'UTF-8', function (err, data) {
                            data = data.replace("SITE_NAME", name);
                            fs.writeFile(path.join(apppath, 'config', 'index.js'), data, {}, function (err) {
                                if (err) console.error("An error occurred while creating the config index.js file");
                            });
                        });
                    });
                    fs.readFile(path.join(__dirname, 'project_structure', 'package.std.json'), 'UTF-8', function (err, data) {
                        data = data.replace("SITE_NAME", name);
                        fs.writeFile(path.join(apppath, 'package.json'), data, {}, function (err) {
                            if (err) console.error("An error occurred while creating the package.json file");
                        });
                    });
                    fs.writeFile(path.join(apppath, '.gitignore'), 'node_modules/*' + os.EOL, function (err) {
                        if (err) {
                            console.error('An error occurred while creating the .gitignore file');
                        }
                    });
                });
            },
            createBlockStructure: function (name) {
                var cwd = process.cwd();
            },
            createBlock: function (name) {
                var cwd = process.cwd();
                var blockpath = path.join(path.join(cwd, "blocks"), name);
                fs.mkdir(blockpath, function () {
                    ncp(path.join(__dirname, 'project_structure', 'new_block', 'backend'), path.join(blockpath, 'backend'));
                    ncp(path.join(__dirname, 'project_structure', 'new_block', 'frontend'), path.join(blockpath, 'frontend'));
                    fs.readFile(path.join(__dirname, 'project_structure', 'new_block', 'descriptor_template'), 'UTF-8', function (err, data) {
                        if (err) {
                            console.error("An error occured while reading the descriptor.json file");
                            throw err;
                        }
//                        console.log(data);
                        var template = Handlebars.compile(data);
                        var context = {name: name};
                        var html = template(context);
                        fs.writeFile(path.join(blockpath, 'descriptor.json'), html, function (err) {
                            if (err) {
                                console.error("An error occured while creating the descriptor.json file");
                                throw err;
                            }
                        });
                        console.log('Block \'' + name + '\' successfully created.');
                    });
                });
            }
        }
    }
};
module.exports = smartblocks;
