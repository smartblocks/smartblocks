requirejs.config({
    baseUrl: '/',
    paths: sb_paths,
    shim: sb_shims
});

var apps = [
    "underscore",
    "backbone",
    "UserModel",
    "UsersCollection",
    "LoadingScreen",
    "bootstrap",
    "less"
];

requirejs(apps,
    function (/*defaults, */_, Backbone, User, UsersCollection, LoadingScreen, bootstrap) {

        bootstrap.init(function () {

        });
    });