define([
    'jquery',
    'underscore',
    'backbone',
    'text!../templates/home.html'
], function ($, _, Backbone, home_tpl) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "home_view",
        initialize: function () {
            var base = this;
        },
        init: function () {
            var base = this;

            base.render();
            base.registerEvents();
        },
        render: function () {
            var base = this;

            var template = _.template(home_tpl, {});
            base.$el.html(template);
        },
        registerEvents: function () {
            var base = this;
        }
    });

    return View;
});