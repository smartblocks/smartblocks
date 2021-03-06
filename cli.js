var app_starter = require('./app');
var fs = require('fs');
var path = require('path');
var smartblocks = require('./lib/smartblocks');
var generation = require('./lib/generation');

var cwd = process.cwd();


var program = require('commander');
var pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json')));
module.exports = function () {
    program
        .version(pkg.version)
        .option('start', 'Start application')
        .option('init [name]', 'Create a new SmartBlocks project in the folder [name].')
        .option('generate_block', 'Create a new block structure in the folder blocks.')
        .option('generate_type', 'Generates a type in the block of your choice, with associated backend/frontend models, controllers and so on.')
        .option('generate_app', 'Generates a new app in the front end of the block of your choice, with an entry view, template and style.')
        .option('generate_controller', 'Generates a new controller in the block of your choice.')
        .option('generate_model', 'Generates a new model in the block of your choice.')
        .option('generate_view', 'Generates view files (Backbone view, template and style file) in the block and app of your choice.')
        .parse(process.argv);

    if (program.start) {
        console.log('Web app starting, use Ctr-C to stop');
        app_starter();
    }

    else if (program.generate_block) {
        generation.generateBlock();
    }

    else if (program.init) {
        if (program.init === true) {
            program.init = '.';
        }
        smartblocks.cli().createProjectStructure(program.init);
    }

    else if (program.generate_type) {
        generation.generateType();
    }

    else if (program.generate_app) {
        generation.generateApp();
    }

    else if (program.generate_controller) {
        generation.generateController();
    }

    else if (program.generate_model) {
        generation.generateModel();
    }

    else if (program.generate_view) {
        generation.generateView();
    }

    else {
        console.log('Usage : smartblocks' + ' command'.yellow);
        console.log('with command: ' + 'init'.green + '|' + 'start'.green + '|' + 'generate_block'.green +
            '|' + 'generate_type'.green + '|' + 'generate_app'.green + '|' + 'generate_controller'.green +
            '|' + 'generate_model'.green + '|' + 'generate_view'.green);
    }
};
