var app_starter = require('./app');
var fs = require('fs');


var program = require('commander');
var pkg = JSON.parse(fs.readFileSync('./package.json'));
module.exports = function () {
    program
        .version(pkg.version)
        .option('start', 'Start application')
        .parse(process.argv);

    if (program.start)  {
        console.log('Web app starting, use Ctr-C to stop');
        app_starter();
    }
};
