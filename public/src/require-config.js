requirejs.config({
    baseUrl: '',
    paths: {
        jquery: "libs/jquery",
        underscore: "libs/underscore",
        backbone: "libs/backbone",
        text: "libs/text",
        Class: 'tools/Class',
        LoadingTemplate: "templates/loading.html",
        LoadingScreen: "views/LoadingScreen",
        sb_basics: "tools/sb_basics",
        less: 'libs/less'

    },
    shim: {
        'underscore': {
            exports: '_'
        },
        underscore_string: {
            deps: ['underscore'],
            exports: '_s'
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        }
    }
});