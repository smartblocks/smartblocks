module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        requirejs: {
            compile: {
                options: {
                    baseUrl: "src",
                    name: 'main',
                    mainConfigFile: 'src/require-config.js',
                    out: 'build/smartblocks-frontend.js'
                }
            }
        },
        watch: {
            scripts: {
                files: 'src/*.js',
                tasks: ['requirejs'],
                options: {
                    interrupt: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', ['requirejs']);
};