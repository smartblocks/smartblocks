define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    var initRouter = function (SmartBlocks) {
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
    };

    return initRouter;
});