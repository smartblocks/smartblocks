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


        var created = {};
        inquirer.prompt(prompts, function (answers) {
            var block_path = path.join(process.cwd(), 'blocks', answers.block_name);

            var prompts2 = [];

            var available_apps = fs.readdirSync(path.join(process.cwd(), 'blocks', answers.block_name, 'frontend', 'apps'));
            var array = [];
            for (var k in available_apps) {
                if (available_apps[k] !== 'empty') {
                    array.push(available_apps[k]);
                }
            }
            available_apps = array;

            if (available_apps.length > 0) {


                var name_chooser = {
                    name: 'app_name',
                    message: 'In what app do you want to add this view?',
                    type: 'list',
                    choices: available_apps
                };

                prompts2.push(name_chooser);

                var view_name_chooser = {
                    name: 'view_name',
                    message: 'What will be the name of the view?',
                    validate: function (input) {
                        return typeof input === 'string' && input.indexOf(/\s/) === -1 && input !== '';
                    }
                };

                prompts2.push(view_name_chooser);
                inquirer.prompt(prompts2, function (answers2) {
                    async.parallel([
                        function (cb) {
                            //view generation
                            fs.readFile(path.join(__dirname, '..', 'templates', 'frontend', 'view.template'), 'UTF-8', function (err, data) {
                                var template = Handlebars.compile(data);
                                var context = {
                                    name: answers2.view_name
                                };
                                var output = template(context);
                                fs.writeFile(path.join(block_path, 'frontend', 'apps', answers2.app_name, 'views', answers2.view_name + '.js'), output, function (err) {
                                    if (!err) {
                                        created.view = true;
                                    }
                                    cb();
                                });
                            });
                        },
                        function (cb) {
                            //style generation
                            fs.writeFile(path.join(block_path, 'frontend', 'apps', answers2.app_name, 'style', answers2.view_name + '.less'), '.' + answers2.view_name + '_view {}', function (err) {
                                if (!err) {
                                    created.style = true;
                                }
                                cb();
                            });
                        },
                        function (cb) {
                            //template generation
                            fs.writeFile(path.join(block_path, 'frontend', 'apps', answers2.app_name, 'templates', answers2.view_name + '.html'), '', function (err) {
                                if (!err) {
                                    created.template = true;
                                }
                                cb();
                            });
                        },
                        function (cb) {
                            fs.readFile(path.join(block_path, 'frontend', 'apps', answers2.app_name, 'style', 'main.less'), 'UTF-8', function (err, data) {
                                if (!err) {
                                    var updated = data + os.EOL + '@import "' + answers2.view_name + '";';
                                    if (updated !== data) {
                                        fs.writeFile(path.join(block_path, 'frontend', 'apps', answers2.app_name, 'style', 'main.less'), updated, function (err) {
                                            if (!err) {
                                                created.style_link = true;
                                            }
                                            cb();
                                        });
                                    } else {
                                        cb();
                                    }
                                } else {
                                    cb();
                                }
                            });
                        }
                    ], function () {
                        console.log('The generation is done. Here\'s how it went :'.yellow);

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
                            console.log('The template could not be created.'.red);
                        }

                        if (created.style_link) {
                            console.log('The link to the style file was successfully created.'.green);
                        } else {
                            console.log('Warning: The link to the style file could not be created.'.yellow);
                        }
                    });

                });
            }
        });

    }
};
