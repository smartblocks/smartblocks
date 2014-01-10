/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var fs = require('fs');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'hjs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(express.bodyParser());
app.use(app.router);
app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

var config = require('./config')();

var MongoClient = require('mongodb').MongoClient;

MongoClient.connect(config.database.connection_str + "/" + config.database.name, function (err, db) {

    if (err) {
        console.log("There is no MongoDB server running");
    } else {

        var attachDB = function (req, res, next) {
            req.db = db;
            next();
        };


        var blocks_folders = fs.readdirSync(path.join(__dirname, 'blocks'));
//blocks webservices
        for (var k in blocks_folders) {
            var block_folder = blocks_folders[k];
            app.use('/' + block_folder, express.static(path.join(__dirname, 'blocks', block_folder, 'frontend')));
            var backend_path = path.join(__dirname, 'blocks', block_folder, 'backend');
            var controllers = fs.readdirSync(path.join(backend_path, 'controllers'));

            for (var c in controllers) {
                var controller_name = controllers[c].replace('.js', '');
                var controller = require('./blocks/' + block_folder + '/backend/controllers/' + controller_name);
                (function (controller_name, controller) {
                    app.get('/' + block_folder + '/' + controller_name, attachDB, function (req, res) {
                        if (controller.index) {

                            controller.index(req, res);
                        }
                    });
                    app.all('/' + block_folder + '/' + controller_name + '/action/:action', attachDB, function (req, res) {
                        if (controller[req.params.action]) {
                            controller[req.params.action](req, res);
                        }
                    });
                    app.get('/' + block_folder + '/' + controller_name + '/:id', attachDB, function (req, res) {
                        if (controller.show) {
                            controller.show(req, res);
                        }
                    });
                    app.post('/' + block_folder + '/' + controller_name, attachDB, function (req, res) {
                        if (controller.create) {
                            controller.create(req, res);
                        }
                    });
                    app.put('/' + block_folder + '/' + controller_name + '/:id', attachDB, function (req, res) {
                        if (controller.update) {
                            controller.update(req, res);
                        }
                    });
                    app.delete('/' + block_folder + '/' + controller_name + '/:id', attachDB, function (req, res) {
                        if (controller.destroy) {
                            controller.destroy(req, res);
                        }
                    });
                })(controller_name, controller);
            }
        }

//kernel webservices
        var controllers = fs.readdirSync(path.join(__dirname, 'smartblocks', 'controllers'));
        for (var c in controllers) {
            var controller_name = controllers[c].replace('.js', '');
            var controller = require('./smartblocks/controllers' + '/' + controller_name);
            (function (controller_name, controller) {
                app.get('/' + controller_name, attachDB, function (req, res) {
                    if (controller.index) {
                        controller.index(req, res);
                    }
                });
                app.all('/' + controller_name + '/action/:action', attachDB, function (req, res) {
                    if (controller[req.params.action]) {
                        controller[req.params.action](req, res);
                    }
                });
                app.get('/' + controller_name + '/:id', attachDB, function (req, res) {
                    if (controller.show) {
                        controller.show(req, res);
                    }
                });
                app.post('/' + controller_name, attachDB, function (req, res) {
                    if (controller.create) {
                        controller.create(req, res);
                    }
                });
                app.put('/' + controller_name + '/:id', attachDB, function (req, res) {
                    if (controller.update) {
                        controller.update(req, res);
                    }
                });
                app.delete('/' + controller_name + '/:id', attachDB, function (req, res) {
                    if (controller.destroy) {
                        controller.destroy(req, res);
                    }
                });
            })(controller_name, controller);


        }

        http.createServer(app).listen(config.port, function () {
            console.log('Express server listening on port ' + app.get('port'));
        });
    }
});

