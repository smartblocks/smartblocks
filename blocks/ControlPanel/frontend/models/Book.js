define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    var Model = Backbone.Model.extend({
        default: {

        },
        urlRoot: "/ControlPanel/Books"
    });
    return Model;
});