var path = require('path');
var fs = require('fs');
var ncp = require('ncp').ncp;
var Handlebars = require('handlebars');
var async = require('async');
var os = require('os');

var cache = {
    block_models: []
};

var smartblocks = {
    getBlocks: function (callback) {
        var blocks_folders = fs.readdirSync(path.join(process.cwd(), 'blocks'));
        return blocks_folders;
    },
    getBlocksModels: function (callback) {
        var base = this;
        var models = [];
        if (cache.block_models.length > 0) {
            callback(cache.block_models);
        } else {
            fs.readdir(path.join(process.cwd(), 'blocks'), function (err, blocks_folders) {
                if (!err)
                    async.parallel([
                        function (next) {
                            async.each(blocks_folders, function (block_name, next2) {
                                var block_descriptor_path = path.join(process.cwd(), '/blocks/', block_name, '/descriptor.json');
                                (function (block_descriptor_path) {
                                    fs.readFile(block_descriptor_path, 'UTF-8', function (err, data) {
                                        var descriptor = JSON.parse(data);
                                        if (descriptor) {
                                            descriptor.location = path.join(process.cwd(), '/blocks/', block_name);
                                            models.push(descriptor);
                                        }
                                        next2();
                                    });
                                })(block_descriptor_path);
                            }, function () {
                                next();
                            });
                        },
                        function (next) {
                            base.getForeignBlocks(function (foreign_blocks) {
                                async.each(foreign_blocks, function (block, next) {
                                    fs.readFile(block.descriptor_path, 'UTF-8', function (err, data) {
                                        var descriptor = JSON.parse(data);
                                        if (descriptor) {
                                            descriptor.location = block.location;
                                            models.push(descriptor);
                                        }
                                        next();
                                    });
                                }, function () {
                                    next();
                                });
                            });
                        }
                    ], function () {
                        cache.block_models = models;
                        callback(models);
                    });
            });
        }


    },
    getForeignBlocks: function (callback) {
        require('child_process').exec('npm ls --json', function (err, stdout, stderr) {

            var modules = JSON.parse(stdout).dependencies;
            var installed_blocks_folders = [];
            for (var k in modules) {
                var mname = k;
                if (mname.indexOf('smartblocks-') === 0) {
                    var block = require(path.join(process.cwd(), 'node_modules', k));
                    if (block.smartblocks_block && block.location) {
                        var name = mname.split('-');
                        name.shift();
                        var display_name = '';
                        for (var i in name) {
                            display_name += name[i][0].toUpperCase() + name[i].substr(1);

                            installed_blocks_folders.push({
                                name: display_name,
                                location: block.location,
                                frontend_path: path.join(block.location, 'frontend'),
                                backend_path: path.join(block.location, 'backend'),
                                descriptor_path: path.join(block.location, 'descriptor.json')
                            });
                        }
                    }
                }
            }
            callback(installed_blocks_folders);
        });
    },
    getApplications: function (descriptor, callback) {

        for (var k in descriptor.apps) {
            descriptor.apps[k].block_token = descriptor.name;
        }
        callback(null, descriptor.apps);
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
                    fs.mkdir(path.join(apppath, 'layouts'), function (err) {
                        if (err) {
                            console.log('An error occured');
                        } else {
                            ncp(path.join(__dirname, '..', 'views', 'index.hjs'), path.join(apppath, 'layouts', 'index.hjs'));
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
