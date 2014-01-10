define([
    'jquery',
    'underscore',
    'backbone',
    '../models/Book'
], function ($, _, Backbone, Book) {
    var Collection = Backbone.Collection.extend({
        model: Book,
        url: "/ControlPanel/Books"
    });

    return Collection;
});