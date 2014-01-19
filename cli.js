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
        .option('init [name]', 'Create a new SmartBlocks project in the folder [name]')
        .option('generate_block', 'Create a new block structure in the folder blocks / [name]')
        .option('generate_type', 'Generates a type in the block of your choice, with associated backend/frontend models, controllers and so on.')
        .parse(process.argv);

    if (program.start) {
        console.log('Web app starting, use Ctr-C to stop');
        app_starter();
    }

    if (program.generate_block) {
        generation.generateBlock();
    }

    if (program.init) {
        if (program.init === true) {
            program.init = '.';
        }
        smartblocks.cli().createProjectStructure(program.init);
    }

    if (program.generate_type) {
        generation.generateType();
    }

    if (program.generate_app) {
        generation.generateType();
    }
};
