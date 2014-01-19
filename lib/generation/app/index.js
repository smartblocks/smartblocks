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


        var name_chooser = {
            name: 'app_name',
            message: 'What will be the name of the app?'
        };

        prompts.push(name_chooser);

        inquirer.prompt(prompts, function (answers) {
            var block_path = path.join(process.cwd(), 'blocks', answers.block_name);


            async.parallel([
                function (cb) {
                    //Descriptor edition
                    fs.readFile(path.join(block_path, 'descriptor.json'), 'UTF-8', function (err, data) {
                        var descriptor = JSON.parse(data);
                        descriptor.apps.push({
                            name: answers.app_name
                        });
                        fs.writeFile(path.join(block_path, 'descriptor.json'), JSON.stringify(descriptor, null, 4), function (err) {
                            if (err) {
                                console.log('Error while editing the descriptor');
                            } else {
                                created.descriptor = true;
                            }
                            cb();
                        });
                    });
                }
            ], function () {
                console.log('The generation is done. Here\'s how it went :'.yellow);
                if (created.descriptor_entry) {
                    console.log('The app entry was successfully added to the descriptor'.green);
                } else {
                    console.log('The app entry could not be created in the descriptor'.red);
                }
            });
        });
    }
};
