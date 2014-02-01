define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    var initRouter = function (SmartBlocks) {
        SmartBlocks.basics.Router = Backbone.Router.extend({
            routes: {
                '': 'entry',
                '!': 'entry'
            },
            initialize: function () {
                this.route(/^!(..*?)$/, "launch_app", this.launch_app);
                this.routesHit = 0;
                Backbone.history.on('route', function () {
                    this.routesHit++;
                    SmartBlocks.events.trigger("url_changed");
                }, this);
            },
            launch_app: function (route) {
                var apps = SmartBlocks.Data.apps.models;
                route = route ? route : "";
                for (var k in apps) {
                    var app = apps[k];

                    if (app.get('routing') !== undefined && (route == app.get('routing') || (app.get('routing') !== "" && route && route.indexOf(app.get('routing')) === 0))) {
                        var re = new RegExp('^' + app.get('routing'), 'g');
                        var params = route.replace(re, '');
                        params = params.replace(/^\//, '');
                        SmartBlocks.Url.params = params ? params.split('/') : [];
                        SmartBlocks.Url.appname = app.get('name');
                        SmartBlocks.Url.full = route;

                        if (app && (!SmartBlocks.current_app || SmartBlocks.current_app.get("name") != app.get("name"))) {
                            app = SmartBlocks.Data.apps.get(app.get('name'));
                            SmartBlocks.Methods.setApp(app);
                            break;
                        }
                    }
                }
            },
            entry: function () {
                var apps = SmartBlocks.Data.apps.models;

                for (var k in apps) {
                    var app = apps[k];
                    if (app.get('name') == SmartBlocks.Config.entry.app && app.get('block_token') == SmartBlocks.Config.entry.block) {
                        SmartBlocks.Url.params = SmartBlocks.Config.entry.url_params;
                        SmartBlocks.Url.appname = app.get('name');
                        SmartBlocks.Url.full = "";

                        if (app && (!SmartBlocks.current_app || SmartBlocks.current_app.get("name") != app.get("name"))) {
                            app = SmartBlocks.Data.apps.get(app.get('name'));
                            SmartBlocks.Methods.setApp(app);
                            break;
                        }
                    }
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
    };

    return initRouter;
});