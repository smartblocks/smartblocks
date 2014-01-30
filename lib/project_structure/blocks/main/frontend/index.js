define([
    'jquery',
    './apps/home/views/home'
    //new_apps_deps - don't remove that comment
], function ($, HomeView/*new_deps*/) {
    var main = {
        init: function () {

        },
        launch_home: function (app) {
            var home_view = new HomeView();
            SmartBlocks.Methods.render(home_view.$el);
            home_view.init();
        }
        //new_apps - don't remove that comment
    };
    return main;
});