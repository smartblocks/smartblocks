var util = require('util');
var path = require('path');
var inquirer = require('inquirer');
var sb_utils = require('../../smartblocks');
var fs = require('fs');
var Handlebars = require('handlebars');
var async = require('async');
var colors = require('colors');
var ncp = require('ncp');
var os = require('os');
Handlebars.registerHelper("foreach", function (arr, options) {
    if (options.inverse && !arr.length)
        return options.inverse(this);

    return arr.map(function (item, index) {
        item.$index = index;
        item.$first = index === 0;
        item.$last = index === arr.length - 1;
        item.$notlast = !item.$last;
        return options.fn(item);
    }).join('');
});


module.exports = {
    run: function () {

        var prompts = [];
        var block_chooser = {
            type: 'list',
            name: 'block_name',
            choices: [],
            message: 'In which block do you want to create your app?'
        };
        var block_names = sb_utils.getBlocks();

        for (var k in block_names) {
            block_chooser.choices.push(block_names[k]);
        }
        prompts.push(block_chooser);


        var name_chooser = {
            name: 'app_name',
            message: 'What will be the name of the app?'
        };

        prompts.push(name_chooser);
        var created = {};
        inquirer.prompt(prompts, function (answers) {
            var block_path = path.join(process.cwd(), 'blocks', answers.block_name);

            fs.mkdir(path.join(block_path, 'frontend', 'apps', answers.app_name), function (err) {
                if (!err) {
                    async.parallel([
                        function (cb) {
                            //Descriptor edition
                            fs.readFile(path.join(block_path, 'descriptor.json'), 'UTF-8', function (err, data) {
                                var descriptor = JSON.parse(data);
                                descriptor.apps.push({
                                    name: answers.app_name,
                                    entry_point: 'launch_' + answers.app_name
                                });
                                fs.writeFile(path.join(block_path, 'descriptor.json'), JSON.stringify(descriptor, null, 4), function (err) {
                                    if (!err) {
                                        created.descriptor_entry = true;
                                    }
                                    cb();
                                });
                            });
                        },
                        function (cb) {
                            //Front-end model generation
                            fs.readFile(path.join(__dirname, 'templates', 'frontend', 'view.template'), 'UTF-8', function (err, data) {
                                var template = Handlebars.compile(data);
                                var context = {
                                    name: answers.app_name
                                };
                                var output = template(context);
                                fs.mkdir(path.join(block_path, 'frontend', 'apps', answers.app_name, 'views'), function (err) {
                                    fs.writeFile(path.join(block_path, 'frontend', 'apps', answers.app_name, 'views', 'main.js'), output, function (err) {
                                        if (!err) {
                                            created.view = true;
                                        }
                                        cb();
                                    });
                                });
                            });
                        },
                        function (cb) {
                            //style generation
                            fs.mkdir(path.join(block_path, 'frontend', 'apps', answers.app_name, 'style'), function (err) {
                                if (err) {
                                    console.log('Error while creating the style folder');
                                    cb();
                                }
                                else {
                                    fs.writeFile(path.join(block_path, 'frontend', 'apps', answers.app_name, 'style', 'main.less'), '.nothing {}', function (err) {
                                        if (!err) {
                                            created.style = true;
                                        }
                                        cb();
                                    });
                                }
                            });
                        },
                        function (cb) {
                            //template generation
                            fs.mkdir(path.join(block_path, 'frontend', 'apps', answers.app_name, 'templates'), function (err) {
                                if (err) {
                                    console.log('Error while creating the templates file');
                                    cb();
                                }
                                else {
                                    fs.writeFile(path.join(block_path, 'frontend', 'apps', answers.app_name, 'templates', 'main.html'), '', function (err) {
                                        if (!err) {
                                            created.template = true;
                                        }
                                        cb();
                                    });
                                }
                            });
                        },
                        function (cb) {
                            fs.readFile(path.join(block_path, 'frontend', 'index.js'), 'UTF-8', function (err, data) {
                                if (err) {
                                    console.log('Could not read the index.js file'.red);
                                    cb();
                                } else {
                                    var updated = data.replace(os.EOL + '        //new_apps - don\'t remove that comment', ',' + os.EOL + '        launch_' + answers.app_name + ': function (app) {\n\n        }\n        //new_apps - don\'t remove that comment');
                                    if (updated !== data) {
                                        fs.writeFile(path.join(block_path, 'frontend', 'index.js'), updated, function (err) {
                                            if (!err) {
                                                created.index = true;
                                            }
                                            cb();
                                        });
                                    } else {
                                        cb();
                                    }

                                }
                            });
                        }
                    ], function () {
                        console.log('The generation is done. Here\'s how it went :'.yellow);
                        if (created.descriptor_entry) {
                            console.log('The app entry was successfully added to the descriptor'.green);
                        } else {
                            console.log('The app entry could not be created in the descriptor'.red);
                        }

                        if (created.index) {
                            console.log('The launch method was successfully created in the index.js file.'.green);
                        } else {
                            console.log('The launch method could not be created in the index.js file.'.red);
                        }

                        if (created.view) {
                            console.log('The Backbone view was successfully created.'.green);
                        } else {
                            console.log('The Backbone view could not be created.'.red);
                        }

                        if (created.style) {
                            console.log('The style file was successfully created.'.green);
                        } else {
                            console.log('The style file could not be created.'.red);
                        }

                        if (created.template) {
                            console.log('The template was successfully created.'.green);
                        } else {
                            console.log('The template view could not be created.'.red);
                        }

                    });
                } else {
                    console.log("An error occurred while creating the app");
                }
            });
        });
    }
};
