var rewire = require('rewire');
var os = require('os');
var smartblocks = rewire('../lib/smartblocks');
var fs = require('fs');
var path = require('path');
var cwd = process.cwd();
var testlib = require('./testlib');



smartblocks.__set__('ncp', function (param1, param2) {

});

describe('smartblocks cli', function (next) {
    it('should be able to create a project structure', function () {
        var cwd_representation = {};
        var cli = smartblocks.cli();
        smartblocks.__set__('fs', testlib.fs(cwd_representation));
        cli.createProjectStructure('PROJECT');
        expect(cwd_representation).toEqual({
            'PROJECT': {
                'config': {
                    'index.js': 'file_contents'
                },
                'package.json': 'file_contents'
            }
        });
    });
});