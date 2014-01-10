var sb_paths = {
    jquery: "/libs/jquery",
    underscore: "/libs/underscore",
    backbone: "/libs/backbone",
    text: "/libs/text",
    UserModel: "models/user",
    UsersCollection: "collections/users",
    Class: '/toos/Class',
    LoadingTemplate: "/templates/loading.html",
    LoadingScreen: "/views/LoadingScreen",
    sb_basics: "/tools/sb_basics",
    less: "/libs/less"

};

var sb_shims = {

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
};