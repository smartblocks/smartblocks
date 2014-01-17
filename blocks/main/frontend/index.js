define([
    './apps/home/views/home'
], function (HomeView) {
    var main = {
        init: function () {

        },
        launch_home: function (app) {
            var home_view = new HomeView();
            SmartBlocks.Methods.render(home_view.$el);
            home_view.init();
        }
    };
    return main;
});