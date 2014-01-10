module.exports = {
    index: function (req, res) {
        var configs = require('../../config/front-end-config');
        res.json(configs);
    }
};