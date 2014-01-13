var bcrypt = require('bcryptjs');
module.exports = {
    index: function (req, res) {
        var configs = require(process.cwd() + '/config/front-end-config');
        var next = function () {
            res.json(configs);
        }

        if (req.session.session_id) {
            configs.session_id = req.session.session_id;
            next();
        } else {
            var string = new Date().getTime() + Math.random() * 1000;
            bcrypt.genSalt(10, function(err, salt) {
                req.session.session_id = salt;
                configs.session_id = req.session.session_id;
                next();
            });
        }
    }
};