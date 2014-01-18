var app_starter = require('./app');
var fs = require('fs');
var path = require('path');
var smartblocks = require('./lib/smartblocks');

var cwd = process.cwd();


var program = require('commander');
var pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json')));
module.exports = function () {
    program
        .version(pkg.version)
        .option('start', 'Start application')
        .option('init [name]', 'Create a new SmartBlocks project in the folder [name]')
        .option('create_block [name]', 'Create a new block structure in the folder blocks / [name]')
        .parse(process.argv);

    if (program.start) {
        console.log('Web app starting, use Ctr-C to stop');
        app_starter();
    }

    if (program.create_block) {
        smartblocks.cli().createBlock(program.create_block);
    }

    if (program.init) {
        if (program.init === true) {
            program.init = '.';
        }
        smartblocks.cli().createProjectStructure(program.init);
    }
};
