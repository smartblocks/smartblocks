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

    prompts2.push({
        name: 'name',
        message: 'What\s the name of the field?',
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
            message: 'In which block do you want to create your type?'
        };
        var block_names = sb_utils.getBlocks();

        for (var k in block_names) {
            block_chooser.choices.push(block_names[k]);
        }
        prompts.push(block_chooser);


        var name_chooser = {
            name: 'type_name',
            message: 'What will be the name of the type?',
            validate: function (input) {
                return typeof input === 'string' && input.indexOf(/\s/) === -1 && input !== '';
            }
        };

        prompts.push(name_chooser);

        var add_field = {
            type: 'confirm',
            name: 'add_field',
            message: 'Do you want to add this type\'s fields from here?'
        };

        prompts.push(add_field);

        inquirer.prompt(prompts, function (answers) {
            var block_path = path.join(process.cwd(), 'blocks', answers.block_name);
            var model_path = path.join(block_path, 'backend', 'models', answers.type_name + '.js');
            var controller_path = path.join(block_path, 'backend', 'controllers', answers.type_name + 's.js');
            var add_new_field = answers.add_field;

            promptField(function (fields) {
                var created = {};
                async.parallel([
                    function (cb) {
                        //Model creation
                        fs.exists(model_path, function (exists) {
                            if (!exists) {
                                fs.readFile(path.join(__dirname, 'templates', 'backend', 'model.template'), 'UTF-8', function (err, data) {
                                    var template = Handlebars.compile(data);
                                    var context = {
                                        name: answers.type_name,
                                        fields: fields
                                    };
                                    var output = template(context);
                                    fs.writeFile(model_path, output, function (err) {
                                        if (err) {
                                            console.log('Error while creating the model');
                                        } else {
                                            created.model = true;
                                        }
                                        cb();
                                    });
                                });

                            } else {
                                console.log("A model with that name already exists");
                                cb();
                            }
                        })
                    },
                    function (cb) {
                        //Controller creation
                        fs.exists(controller_path, function (exists) {
                            if (!exists) {
                                fs.readFile(path.join(__dirname, 'templates', 'backend', 'controller.template'), 'UTF-8', function (err, data) {
                                    var template = Handlebars.compile(data);
                                    var context = {
                                        model_name: answers.type_name,
                                        model_name_lower: answers.type_name.toLowerCase()
                                    };
                                    var output = template(context);
                                    fs.writeFile(controller_path, output, function (err) {
                                        if (err) {
                                            console.log('Error while creating the controller');
                                        } else {
                                            created.controller = true;
                                        }
                                        cb();
                                    });
                                });

                            } else {
                                console.log("A controller with that name already exists");
                                cb();
                            }
                        })
                    },
                    function (cb) {
                        //Descriptor edition
                        fs.readFile(path.join(block_path, 'descriptor.json'), 'UTF-8', function (err, data) {
                            var descriptor = JSON.parse(data);
                            descriptor.types.push({
                                name: answers.type_name,
                                plural: answers.type_name.toLowerCase() + 's'
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
                    },
                    function (cb) {
                        //Front-end model generation
                        fs.readFile(path.join(__dirname, 'templates', 'frontend', 'model.template'), 'UTF-8', function (err, data) {
                            var template = Handlebars.compile(data);
                            var context = {
                                block_name: answers.block_name,
                                controller_name: answers.type_name + 's'
                            };
                            var output = template(context);
                            fs.writeFile(path.join(block_path, 'frontend', 'models', answers.type_name + '.js'), output, function (err) {
                                if (err) {
                                    console.log('Error while creating the front end model');
                                } else {
                                    created.frontend_model = true;
                                }
                                cb();
                            });
                        });
                    },
                    function (cb) {
                        //Front-end model generation
                        fs.readFile(path.join(__dirname, 'templates', 'frontend', 'collection.template'), 'UTF-8', function (err, data) {
                            var template = Handlebars.compile(data);
                            var context = {
                                block_name: answers.block_name,
                                controller_name: answers.type_name + 's',
                                model_name: answers.type_name
                            };
                            var output = template(context);
                            fs.writeFile(path.join(block_path, 'frontend', 'collections', answers.type_name + 's' + '.js'), output, function (err) {
                                if (err) {
                                    console.log('Error while creating the front end collection');
                                } else {
                                    created.frontend_collection = true;
                                }
                                cb();
                            });
                        });
                    }

                ], function () {
                    console.log('The generation is done. Here\'s how it went :'.yellow);
                    if (created.model) {
                        console.log('The model was successfully created'.green);
                    } else {
                        console.log('The model could not be created'.red);
                    }
                    if (created.controller) {
                        console.log('The controller was successfully created'.green);
                    } else {
                        console.log('The controller could not be created'.red);
                    }
                    if (created.descriptor) {
                        console.log('The descriptor was successfully edited'.green);
                    } else {
                        console.log('The descriptor could not be edited'.red);
                    }
                    if (created.frontend_model) {
                        console.log('The front end model was successfully created'.green);
                    } else {
                        console.log('The front end model could not be created'.red);
                    }

                    if (created.frontend_collection) {
                        console.log('The front end collection was successfully created'.green);
                    } else {
                        console.log('The front end collection could not be created'.red);
                    }
                });


            });


        });
    }
};

