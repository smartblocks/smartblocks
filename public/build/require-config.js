if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== "function") {
            // closest thing possible to the ECMAScript 5 internal IsCallable function
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }

        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function () {},
            fBound = function () {
                return fToBind.apply(this instanceof fNOP && oThis
                    ? this
                    : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}

requirejs.config({
    baseUrl: '',
    paths: {
        jquery: "libs/jquery",
        underscore: "libs/underscore",
        backbone: "libs/backbone",
        text: "libs/text",
        UserModel: "models/user",
        UsersCollection: "collections/users",
        Class: 'tools/Class',
        LoadingTemplate: "templates/loading.html",
        LoadingScreen: "views/LoadingScreen",
        sb_basics: "tools/sb_basics"

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