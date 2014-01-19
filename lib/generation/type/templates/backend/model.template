module.exports = function (db, cb) {
    db.define('{{ name }}', {
        {{#foreach fields}}{{this.name}}:{{this.type}}{{#if this.$notlast}},
        {{/if}}{{/foreach}}
    });
    return cb();
};