/**
 * Module dependencies.
 */
module.exports = function () {

    var express = require('express');
    var http = require('http');
    var path = require('path');
    var fs = require('fs');
    var os = require('os');
    var orm = require('orm');

    var app = express();

    var config = require(path.join(process.cwd(), 'config'))();



    app.set('port', config.port || process.env.PORT || 3000);
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'hjs');
    console.log(config.database.connection_str);
    app.use(orm.express(config.database.connection_str, {
        define: function (db, models, next) {
            console.log('registering users');
            models.User = db.define('User', {
                email: String,
                password: String,
                session_id: String
            }, {
                methods: {

                }
            });
            next();
        }
    }));


    app.use(express.favicon());
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(require('connect-multiparty')());
    app.use(express.methodOverride());
    app.use(express.cookieParser('your secret here'));
    app.use(express.session());


    app.use(app.router);
    app.use(require('less-middleware')({ src: path.join(__dirname, 'public/build') }));
    app.use(express.static(path.join(__dirname, 'public/build')));


    if ('development' == app.get('env')) {
        app.use(express.errorHandler());
    }


// [begin] Implementing RESTful Web Services with controllers in lib and backend folder.  ****/
    var blocks_folders = fs.readdirSync(path.join(process.cwd(), 'blocks'));
//backend blocks webservices
    for (var k in blocks_folders) {
        var block_folder = blocks_folders[k];
        var frontend_path = path.join(process.cwd(), 'blocks', block_folder, 'frontend');
        var backend_path = path.join(process.cwd(), 'blocks', block_folder, 'backend');
        app.use('/' + block_folder, express.static(frontend_path));
        var controllers = fs.readdirSync(path.join(backend_path, 'controllers'));

        for (var c in controllers) {
            var controller_name = controllers[c].replace('.js', '');
            var controller = require(path.join(process.cwd(), 'blocks', block_folder, 'backend', 'controllers', controller_name));
            (function (controller_name, controller) {
                app.get('/' + block_folder + '/' + controller_name, function (req, res) {
                    if (controller.index) {
                        controller.index(req, res);
                    }
                });
                app.all('/' + block_folder + '/' + controller_name + '/action/:action', function (req, res) {
                    if (controller[req.params.action]) {
                        controller[req.params.action](req, res);
                    }
                });
                app.get('/' + block_folder + '/' + controller_name + '/:id', function (req, res) {
                    if (controller.show) {
                        controller.show(req, res);
                    }
                });
                app.post('/' + block_folder + '/' + controller_name, function (req, res) {
                    if (controller.create) {
                        controller.create(req, res);
                    }
                });
                app.put('/' + block_folder + '/' + controller_name + '/:id', function (req, res) {
                    if (controller.update) {
                        controller.update(req, res);
                    }
                });
                app.delete('/' + block_folder + '/' + controller_name + '/:id', function (req, res) {
                    if (controller.destroy) {
                        controller.destroy(req, res);
                    }
                });
            })(controller_name, controller);
        }
    }

//lib kernel webservices
    var controllers = fs.readdirSync(path.join(__dirname, 'lib', 'controllers'));
    for (var c in controllers) {
        var controller_name = controllers[c].replace('.js', '');
        var controller = require('./lib/controllers' + '/' + controller_name);
        (function (controller_name, controller) {
            app.get('/' + controller_name, function (req, res) {
                if (controller.index) {
                    controller.index(req, res);
                }
            });
            app.all('/' + controller_name + '/action/:action', function (req, res) {
                if (controller[req.params.action]) {
                    controller[req.params.action](req, res);
                }
            });
            app.get('/' + controller_name + '/:id', function (req, res) {
                if (controller.show) {
                    controller.show(req, res);
                }
            });
            app.post('/' + controller_name, function (req, res) {
                if (controller.create) {
                    controller.create(req, res);
                }
            });
            app.put('/' + controller_name + '/:id', function (req, res) {
                if (controller.update) {
                    controller.update(req, res);
                }
            });
            app.delete('/' + controller_name + '/:id', function (req, res) {
                if (controller.destroy) {
                    controller.destroy(req, res);
                }
            });
        })(controller_name, controller);
    }
// [end] Implementing RESTful Web Services with controllers in lib and backend folder.  ****/

    app.all('/', function (req, res) {
        res.render('index', {
            site: config.site
        });
    });

    var server = http.createServer(app);
    server.listen(config.port, function () {
        console.log(' __   __   __\n' +
            '|__| |__| |__|\n' +
            ' __   __   __\n' +
            '|__| |__| |__|\n' +
            ' __   __   __\n' +
            '|__| |__| |__|\n\n' +
            ' SMART BLOCKS\nRunning on ' + app.get('port'));
    });

    var io = require('socket.io').listen(server, { log: false });

    io.sockets.on('connection', function (socket) {
        socket.on('set id', function (session_id) {
            socket.set('id', session_id);
        });

        socket.on('send_message', function (session_id, message) {
            var clients = io.sockets.clients();
            for (var k in clients) {
                var client = clients[k];
                client.get('id', function (err, id) {
                    if (id == session_id) {
                        client.emit("msg", message);
                    }
                });
            }
        });

        socket.on('broadcast_message', function (message) {
            io.sockets.emit('msg', message);
        });
    });


};