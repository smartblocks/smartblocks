define([
    'underscore',
    'backbone'

], function (_, Backbone) {
    var Block = Backbone.Model.extend({
        idAttribute: 'name',
        baseUrl:"blocks",
        defaults:{
            "color":"#024053"
        }
    });

    return Block;
});