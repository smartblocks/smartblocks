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
        }
    });

    grunt.loadNpmTasks('grunt-contrib-requirejs');

    // Default task(s).
    grunt.registerTask('default', ['requirejs']);
};