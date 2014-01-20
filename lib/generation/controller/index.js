var util = require('util');
var path = require('path');
var inquirer = require('inquirer');
var sb_utils = require('../../smartblocks');
var fs = require('fs');
var Handlebars = require('handlebars');
var async = require('async');
var colors = require('colors');
var ncp = require('ncp');

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

        prompts.push({
            name: 'controller_name',
            message: 'What will be the name of your controller?'
        });

        inquirer.prompt(prompts, function (answers) {
            var block_path = path.join(process.cwd(), 'blocks', answers.block_name);
            var controller_path = path.join(block_path, 'backend', 'controllers', answers.controller_name + '.js');
            var created = {};

            async.parallel([
                function (cb) {
                    //Controller creation
                    fs.exists(controller_path, function (exists) {
                        if (!exists) {
                            fs.readFile(path.join(__dirname, '..', 'templates', 'backend', 'controller.template'), 'UTF-8', function (err, data) {
                                var template = Handlebars.compile(data);
                                var context = {
                                };
                                var output = template(context);
                                fs.writeFile(controller_path, output, function (err) {
                                    if (err) {
                                    } else {
                                        created.controller = true;
                                    }
                                    cb();
                                });
                            });

                        } else {
                            cb();
                        }
                    })
                }
            ],
                function () {
                    console.log('The generation is done. Here\'s how it went :'.yellow);
                    if (created.controller) {
                        console.log('The controller was successfully created'.green);
                    } else {
                        console.log('The controller could not be created'.red);
                    }
                });
        });
    }
};