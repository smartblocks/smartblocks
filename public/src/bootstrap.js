define([
    'jquery',
    'underscore',
    'backbone',
    "LoadingScreen",
    "sb_basics"
], function ($, _, Backbone, LoadingScreen, sb_basics) {

    var temp = {};
    var init_list = [];


    function init_blocks() {

        var blocks = SmartBlocks.Data.blocks;
        var blocks_count = blocks.models.length;
        var processed_blocks = 0;
        for (var k in blocks.models) {
            var block = blocks.models[k];

            (function (block) {
                SmartBlocks.Blocks[block.get("name")].Config = block.get('config');
                require([block.get("name") + '/index'], function (main) {
                    if (main) {
                        if (main.init) {
                            init_list.push(main);
                        }
                        if (main.methods) {
                            SmartBlocks.Blocks[block.get("name")].Methods = main.methods;
                        }
                        SmartBlocks.Blocks[block.get("name")].Main = main;
                    }

                    processed_blocks++;
                    if (processed_blocks >= blocks_count) {
                        SmartBlocks.Methods.continueMainLoading((1 / blocks_count) * 2, "Initiating");

                        for (var k in init_list) {
                            init_list[k].init();
                        }

                        SmartBlocks.events.trigger("start_solution");
                    }
                });

                SmartBlocks.Blocks[block.get("name")].rights = block.get('rights');
            })(block);
        }
    }

    function load_blocks() {
        SmartBlocks.Data.blocks.fetch({
            success: function () {
                SmartBlocks.Methods.continueMainLoading(1, "Loading config");
//                amplify.store("sb.data.blocks", SmartBlocks.Data.blocks.toArray());
                load_config();
            },
            error: function () {
                SmartBlocks.Methods.continueMainLoading(1, "Loading config");
//                SmartBlocks.Data.blocks = new SmartBlocks.Collections.Blocks(amplify.store("sb.data.blocks"));
                load_config();
            }
        });
    }

    function load_config() {
        SmartBlocks.Methods.continueMainLoading(1, "Loading config");
        $.ajax({
            url: "/Configs",
            success: function (data, status) {
                SmartBlocks.Config = data;
                after_config();
            },
            error: function () {
                after_config();
            }
        });
    }

    function after_config() {

        var blocks = SmartBlocks.Data.blocks;
        SmartBlocks.Methods.count = 0;
        for (var k in blocks.models) {
            var block = blocks.models[k];
            var types = block.get("types");
            SmartBlocks.Methods.count += types != null ? types.length : 0;
        }
        SmartBlocks.Methods.processed = 0;
        SmartBlocks.Blocks = {};
        var types_count = 0;
        for (var k in blocks.models) {
            var block = blocks.models[k];
            var types = block.get("types");
            SmartBlocks.Blocks[block.get("name")] = {
                Models: {},
                Collections: {},
                Data: {},
                Config: {}
            };
            for (var t in types) {
                var type = types[t];
                SmartBlocks.Methods.addType(type, block);
                types_count++;
            }

        }
        if (types_count == 0) {
            init_blocks();
        }

        if (window.io) {
            var socket = io.connect("/");
            socket.emit('set id', SmartBlocks.Config.session_id);
            socket.on('msg', function (data) {
                SmartBlocks.events.trigger("ws_notification", data);
            });
            SmartBlocks.socket = socket;
            SmartBlocks.sendWs = function (session_id, message) {
                socket.emit('send_message', session_id, message);
            };
            SmartBlocks.broadcastWs = function (message) {
                SmartBlocks.events.trigger("broadcastWs", message);
                socket.emit('broadcast_message', message);
            }
        }


        //Hearbeats. If I'm living, my heart beats.
        SmartBlocks.events.on("ws_notification", function (message) {
            if (message.app == "heartbeat") {
                SmartBlocks.basics.connected_users.push(message.user);
                clearTimeout(timers[message.user.id]);
                timers[message.user.id] = setTimeout(function () {
                    SmartBlocks.basics.connected_users.remove(message.user);
                }, 10000);
            }
        });

        setInterval(function () {
            //SmartBlocks.heartBeat(current_user);
        }, 5000);
    }

    var SmartBlocks = {
        Url: {
            params: []
        },
        basics: sb_basics,
        events: null,
        current_session: null,
        current_user: null,
        router: null,
        init: function (callback, production) {
            temp.callback = callback;

            if (production) {
                console.log = function () {
                };
            }

            SmartBlocks.events = _.extend({}, Backbone.Events);

            SmartBlocks.started = false;


            SmartBlocks.events.on("start_solution", function () {

                //Done loading everything, launching main app
                if (!SmartBlocks.started) {
                    SmartBlocks.Methods.start();
                    if (temp.callback) {
                        temp.callback();
                    }
                }
                SmartBlocks.started = true;
            });

            SmartBlocks.basics.Router = Backbone.Router.extend({
                routes: {
                    "": "entry",
                    "!": "entry",
                    "!:appname": "launch_app",
                    ":appname": "launch_app",
                    "!:appname/:params": "launch_app",
                    ":appname/:params": "launch_app"
                },
                initialize: function () {
                    this.route(/^!([a-zA-Z]*?)\/(.*?)$/, "launch_app", this.launch_app);
                    this.routesHit = 0;
                    Backbone.history.on('route', function () {
                        this.routesHit++;
                        SmartBlocks.events.trigger("url_changed");
                    }, this);
                },
                entry: function () {
                    SmartBlocks.Url.params = {};
                    SmartBlocks.Url.appname = "";
                    SmartBlocks.Url.full = "";
                    SmartBlocks.Methods.entry();
                },
                launch_app: function (appname, params) {

                    SmartBlocks.Url.params = params ? params.split("/") : [];
                    SmartBlocks.Url.appname = appname;
                    SmartBlocks.Url.full = appname + "/" + params;
                    var app = SmartBlocks.Data.apps.where({
                        name: appname
                    })[0];
                    if (app && (!SmartBlocks.current_app || SmartBlocks.current_app.get("name") != app.get("name"))) {
                        app = SmartBlocks.Data.apps.get(app.get('name'));
                        SmartBlocks.Methods.setApp(app);
                    } else {
                        if (!app)
                            SmartBlocks.Methods.entry();
                    }
                },
                back: function () {
                    if (this.routesHit > 1) {
                        window.history.back();
                    } else {
                        window.location = "#";
                    }
                }

            });

            SmartBlocks.Shortcuts = {
                initial_shortcuts: [
                ],
                init: function () {
                    var base = this;

                    base.shortcuts = $.extend([], base.initial_shortcuts);

                    base.keydown_list = {};

                    $(document).bind("keydown", function (e) {
                        base.keydown_list[e.keyCode] = true;
                        var active_keys = [];
                        for (var k in base.keydown_list) {
                            if (base.keydown_list[k]) {
                                active_keys.push(k);
                            }
                        }
                        for (var k in base.shortcuts) {
                            var shortcut = base.shortcuts[k];
                            var checked_keys = 0;
                            for (var i in shortcut.keys) {
                                var key = shortcut.keys[i];
                                if (base.keydown_list[key]) {
                                    checked_keys += 1;
                                }
                            }
                            if (checked_keys == active_keys.length && checked_keys == shortcut.keys.length) {
                                if (!shortcut.url_mask || ("#" + SmartBlocks.Url.full).indexOf(shortcut.url_mask) == 0) {
                                    shortcut.action();
                                    e.preventDefault();
                                }
                            }
                        }
                    });

                    $(document).bind("keyup", function (e) {
                        for (var k in base.keydown_list) {
                            base.keydown_list[k] = false;
                        }
                    });
                },
                add: function (list, callback, url_mask) {
                    var base = this;
                    base.shortcuts.push({
                        keys: list,
                        action: callback,
                        url_mask: url_mask
                    });
                },
                clear: function () {
                    var base = this;
                    base.shortcuts = $.extend({}, base.initial_shortcuts);
                }
            };

            SmartBlocks.Shortcuts.init();
            SmartBlocks.router = new SmartBlocks.basics.Router();
            SmartBlocks.basics.init_solution();
            SmartBlocks.Data.blocks = new SmartBlocks.Collections.Blocks();
            SmartBlocks.Data.apps = new SmartBlocks.Collections.Applications();
            SmartBlocks.Methods.startMainLoading("Loading apps", 8);

            SmartBlocks.Data.apps.fetch({
                success: function () {
                    SmartBlocks.Methods.continueMainLoading(1, "Loading blocks");
                    load_blocks();
                },
                error: function () {
                    SmartBlocks.Methods.continueMainLoading(1, "Loading blocks");
                    load_blocks();
                }
            });
        },
        States: {
            main_loading: false
        },
        Methods: {
            start: function () {
                Backbone.history.start();
                $(window).bind("hashchange", function () {
                    SmartBlocks.events.trigger("hashchange");
                    for (var k in SmartBlocks.Data.apps.models) {
                        var app = SmartBlocks.Data.apps.models[k];
                        if (app.ready)
                            app.route();
                        else {
                            app.events.once("ready", function () {
                                app.route();
                            });
                        }

                    }
                });
            },
            render: function (view) {
                var base = this;
                $("#__contents__").html(view);
            },
            setApp: function (app) {
                var base = this;

                app.launch();

            },
            entry: function () {
                if (!SmartBlocks.entry_app) {
                    var block = SmartBlocks.Data.blocks.where({
                        name: SmartBlocks.Config.startup_app.block
                    })[0];
                    if (block) {

                        SmartBlocks.Url.params = SmartBlocks.Config.startup_app.url_params || [];
                        var apps = new SmartBlocks.Collections.Applications(block.get('apps'));
                        var app = apps.where({
                            name: SmartBlocks.Config.startup_app.app
                        })[0];


                        if (app) {
                            app = SmartBlocks.Data.apps.get(app.get('name'));
                            SmartBlocks.entry_app = app;

                            SmartBlocks.Methods.setApp(SmartBlocks.entry_app);

                        }
                    }
                } else {
                    SmartBlocks.Methods.setApp(SmartBlocks.entry_app);
                }


            },
            startMainLoading: function (message, steps, show_pb) {
                if (!SmartBlocks.loading_screen) {
                    SmartBlocks.loading_screen = new LoadingScreen();
                }
                SmartBlocks.Methods.render(SmartBlocks.loading_screen.$el);
                if (show_pb === false) {
                    SmartBlocks.loading_screen.hidePb();
                } else {
                    SmartBlocks.loading_screen.showPb();
                }
                if (!SmartBlocks.loading_screen.initiated) {
                    SmartBlocks.loading_screen.init();
                }
                SmartBlocks.loading_screen.setMax(steps);
                SmartBlocks.loading_screen.setText(message);
                SmartBlocks.loading_screen.setLoad(1);
                SmartBlocks.States.main_loading = true;


            },
            continueMainLoading: function (step_add, message) {
                if (message) {
                    SmartBlocks.loading_screen.setText(message);
                }
                SmartBlocks.loading_screen.setLoad(SmartBlocks.loading_screen.pb_view.load + step_add);
            },
            stopMainLoading: function () {
                SmartBlocks.States.main_loading = false;
            },
            types: {
                count: 0,
                processed: 0
            },
            addType: function (type, block) {
                (function (block) {
                    var collection_name = type.plural.charAt(0).toUpperCase() + type.plural.slice(1);

                    require([block.get('name') + '/models/' + type.name, block.get('name') + '/collections/' + collection_name], function (model, collection) {

                        SmartBlocks.Blocks[block.get("name")].Models[type.name] = model;
                        SmartBlocks.Blocks[block.get("name")].Collections[collection_name] = collection;
                        SmartBlocks.Blocks[block.get("name")].Data[type.plural] = new collection();
                        SmartBlocks.Blocks[block.get("name")].Data[type.plural].fetch({
                            success: function () {
                                SmartBlocks.Methods.continueMainLoading((1 / SmartBlocks.Methods.count) * 3, "Loading data");
//                                    amplify.store("block_data-" + block.get("token"), SmartBlocks.Blocks[block.get("name")].Data[type.plural].toArray());
                                if (++SmartBlocks.Methods.processed >= SmartBlocks.Methods.count) {
                                    init_blocks();
                                }
                            },
                            error: function () {
                                SmartBlocks.Methods.continueMainLoading((1 / SmartBlocks.Methods.count) * 3, "Loading data");
//                                    SmartBlocks.Blocks[block.get("name")].Data[type.plural] = new SmartBlocks.Blocks[block.get("name")].Collections[type.collection_name](amplify.store("block_data-" + block.get("token")));
                                if (++SmartBlocks.Methods.processed >= SmartBlocks.Methods.count) {
                                    init_blocks();
                                }
                            }
                        });

                    });
                })(block);

            }
        }

    };

    window.SmartBlocks = SmartBlocks;

    return SmartBlocks;
});