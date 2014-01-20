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


function promptField(cb, fields) {
    fields = fields || [];
    var prompts2 = [];

    var message = fields.length > 0 ? 'What\s the name of the field?' : 'What\s the name of the first field?';

    prompts2.push({
        name: 'name',
        message: message,
        validate: function (input) {
            return typeof input === 'string' && input.indexOf(/\s/) === -1 && input !== '';
        }
    });

    prompts2.push({
        type: 'list',
        name: 'type',
        choices: ['String', 'Number', 'Boolean', 'Buffer', 'Object'],
        message: 'What\s the type of the field?'
    });

    prompts2.push({
        type: 'confirm',
        name: 'add_field',
        message: 'Add a field?'
    });

    inquirer.prompt(prompts2, function (answers2) {

        fields.push({
            name: answers2.name,
            type: answers2.type
        });
        if (answers2.add_field) {
            promptField(cb, fields);
        } else {
            cb(fields);
        }
    });
}

module.exports = {
    run: function () {
        var prompts = [];
        var block_chooser = {
            type: 'list',
            name: 'block_name',
            choices: [],
            message: 'In which block do you want to create your model?'
        };
        var block_names = sb_utils.getBlocks();

        for (var k in block_names) {
            block_chooser.choices.push(block_names[k]);
        }
        prompts.push(block_chooser);

        prompts.push({
            name: 'model_name',
            message: 'What will be the name of your model?',
            validate: function (input) {
                return typeof input === 'string' && input.indexOf(/\s/) === -1 && input !== '';
            }
        });


        inquirer.prompt(prompts, function (answers) {
            var block_path = path.join(process.cwd(), 'blocks', answers.block_name);
            var model_path = path.join(block_path, 'backend', 'models', answers.model_name + '.js');
            var add_new_field = answers.add_field;
            var created = {};

            promptField(function (fields) {
                var created = {};
                async.parallel([
                    function (cb) {
                        //Model creation
                        fs.exists(model_path, function (exists) {
                            if (!exists) {
                                fs.readFile(path.join(__dirname, '..', 'templates', 'backend', 'model.template'), 'UTF-8', function (err, data) {
                                    var template = Handlebars.compile(data);
                                    var context = {
                                        name: answers.type_name,
                                        fields: fields
                                    };
                                    var output = template(context);
                                    fs.writeFile(model_path, output, function (err) {
                                        if (!err) {
                                            created.model = true;
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
                        if (created.model) {
                            console.log('The model was successfully created'.green);
                        } else {
                            console.log('The model could not be created'.red);
                        }
                    });
            });
        });
    }
};