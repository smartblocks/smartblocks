/**
 * This module loads up everything for the web app to start.
 * Initiates express, the database according to the config, models etc.
 * Then initiates webservices for each block and kernel, after having read every available controller.
 */
module.exports = function () {

    var express = require('express');
    var http = require('http');
    var path = require('path');
    var fs = require('fs');
    var os = require('os');
    var orm = require('orm');
    var async = require('async');

    var app = express();

    var config = require(path.join(process.cwd(), 'config'))();


    var blocks_folders = fs.readdirSync(path.join(process.cwd(), 'blocks'));
    app.set('port', config.port || process.env.PORT || 3000);
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'hjs');

    app.use(orm.express(config.database.connection_str + '/' + config.database.name, {
        define: function (db, models, next) {

            var model_pathes = [];
//            model_pathes.push(path.join(__dirname, 'lib', 'models', 'User.js'));
            //models loading.
            for (var k in blocks_folders) {
                var models_folder = path.join(process.cwd(), 'blocks', blocks_folders[k], 'backend', 'models');
                var model_names = fs.readdirSync(models_folder);
                for (var i in model_names) {
                    var model_name = model_names[i];
                    model_pathes.push(path.join(process.cwd(), 'blocks', blocks_folders[k], 'backend', 'models', model_name));
                }
            }


            async.each(model_pathes, function (path, next) {
                var module = require(path);
                if (typeof module === 'function')
                    module(db, function () {
                        next();
                    });
                else
                    next();

            }, function () {
                for (var k in db.models) {
                    models[k] = db.models[k];
                }
                next();
            });


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

//installed blocks


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


    require('child_process').exec('npm ls --json', function (err, stdout, stderr) {


        var modules = JSON.parse(stdout).dependencies;
        var installed_blocks_folders = [];
        console.log(modules);
        for (var k in modules) {

            var mname = k;
            if (mname.indexOf('smartblocks-') === 0) {
                var block = require(path.join(process.cwd(), 'node_modules', k));
                if (block.smartblocks_block && block.location) {
                    var name = mname.split('-');
                    name.shift();
                    var display_name = '';
                    for (var i in name) {
                        display_name += name[i][0].toUpperCase() + name[i].substr(1);

                        installed_blocks_folders.push({
                            name: display_name,
                            location: block.location,
                            frontend_path: path.join(block.location, 'frontend'),
                            backend_path: path.join(block.location, 'backend')
                        });
                    }
                }
            }
            (function (blocks) {
                for (var k in blocks) {
                    var block = blocks[k];
                    var frontend_path = block.frontend_path;
                    var backend_path = block.backend_path;
                    var name = block.name;
                    app.use('/' + block_folder, express.static(frontend_path));
                    var controllers = fs.readdirSync(path.join(backend_path, 'controllers'));

                    for (var c in controllers) {
                        var controller_name = controllers[c].replace('.js', '');
                        var controller = require(path.join(block.location, 'backend', 'controllers', controller_name));
                        (function (controller_name, controller) {
                            app.get('/' + name + '/' + controller_name, function (req, res) {
                                if (controller.index) {
                                    controller.index(req, res);
                                }
                            });
                            app.all('/' + name + '/' + controller_name + '/action/:action', function (req, res) {
                                if (controller[req.params.action]) {
                                    controller[req.params.action](req, res);
                                }
                            });
                            app.get('/' + name + '/' + controller_name + '/:id', function (req, res) {
                                if (controller.show) {
                                    controller.show(req, res);
                                }
                            });
                            app.post('/' + name + '/' + controller_name, function (req, res) {
                                if (controller.create) {
                                    controller.create(req, res);
                                }
                            });
                            app.put('/' + name + '/' + controller_name + '/:id', function (req, res) {
                                if (controller.update) {
                                    controller.update(req, res);
                                }
                            });
                            app.delete('/' + name + '/' + controller_name + '/:id', function (req, res) {
                                if (controller.destroy) {
                                    controller.destroy(req, res);
                                }
                            });
                        })(controller_name, controller);
                    }
                }
            })(installed_blocks_folders);


        }

        start();
    });

    function start() {
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
    }


};