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

        var prompts = [{
            name: 'block_name',
            message: 'What will be the name of the block?',
            validate: function (input) {
                return typeof input === 'string' && input.indexOf(/\s/) === -1 && input !== '';
            }
        }];

        var blocks = sb_utils.getBlocks();

        inquirer.prompt(prompts, function (answers) {
            var name = answers.block_name;

            if (blocks.indexOf(name) !== -1) {
                console.error("The block could not be created : another block with the same name already exists".red);
            } else {
                var cwd = process.cwd();
                var blockpath = path.join(path.join(cwd, "blocks"), name);
                fs.mkdir(blockpath, function () {
                    ncp(path.join(__dirname, '..', '..', 'project_structure', 'new_block', 'backend'), path.join(blockpath, 'backend'));
                    ncp(path.join(__dirname, '..', '..', 'project_structure', 'new_block', 'frontend'), path.join(blockpath, 'frontend'));
                    fs.readFile(path.join(__dirname, '..', '..', 'project_structure', 'new_block', 'descriptor_template'), 'UTF-8', function (err, data) {
                        if (err) {
                            console.error("An error occured while creating the block".red);
                        } else {
                            var template = Handlebars.compile(data);
                            var context = {name: name};
                            var html = template(context);
                            fs.writeFile(path.join(blockpath, 'descriptor.json'), html, function (err) {
                                if (err) {
                                    console.error("An error occured while creating the block".red);
                                }
                            });
                            console.log(('Block \'' + name + '\' successfully created.').green);
                        }
                    });
                });
            }




        });
    }
};