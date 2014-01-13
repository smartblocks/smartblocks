var View = require('./Base');

var v = new View();
var OtherView = v.extend({
    render: function (data) {
        if (this.response && this.response.send) {
            this.response.send(202, JSON.stringify(data));
        }
    }
});
module.exports = OtherView;