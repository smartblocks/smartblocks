var rewire = require('rewire');
var os = require('os');
var smartblocks = rewire('../lib/smartblocks');

var cwd_representation = {};
var cwd = process.cwd();
var insert_in_directory = function (directory_object, path, depth) {
    if (directory_object[path[depth]]) {
        insert_in_directory(directory_object[path[depth]], path, depth + 1);
    } else {
        directory_object[path[depth]] = {};
    }
};
var insert_file_in_directory = function (directory_object, path, content, depth) {
    if (directory_object[path[depth]]) {
        insert_file_in_directory(directory_object[path[depth]], path, content, depth + 1);
    } else {
        directory_object[path[depth]] = content;
    }
};
var fs_stub = {
    readdir: function (path, callback) {
        console.log('fs.readdir stub called')
        callback(null, [])
    },
    mkdir: function (path, callback) {
        path = path.replace(cwd, '');
        path = path.split(/[\\\/]/);
        while (path[0] == '') {
            path.shift();
        }
        insert_in_directory(cwd_representation, path, 0);
        callback();
    },
    readFile: function (path, mode, callback) {
        callback(null, 'file_contents');
    },
    writeFile: function (path, data, mode, callback) {
        path = path.replace(cwd, '');
        path = path.split(/[\\\/]/);
        while (path[0] == '') {
            path.shift();
        }
        insert_file_in_directory(cwd_representation, path, data, 0);
        callback();
    }
};
smartblocks.__set__('fs', fs_stub);
smartblocks.__set__('ncp', {
    ncp: function () {

    }
});

describe('smartblocks cli', function (next) {
    it('should be able to create a project structure', function () {
        cwd_representation = {};
        var cli = smartblocks.cli();
        cli.createProjectStructure('PROJECT');
        console.log(cwd_representation);
        expect(cwd_representation).toEqual({
            'PROJECT': {
                'blocks': {},
                'config': {
                    'index.js': 'file_contents'
                },
                'package.json' : 'file_contents'
            }
        });
    });
});