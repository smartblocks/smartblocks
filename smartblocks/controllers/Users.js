var UserModel = require('../models/User');
var bcrypt = require('bcryptjs');
module.exports = {
    index: function (req, res) {
        res.send(200, 'users');
    },
    show: function (req, res) {

    },
    create: function (req, res) {
        var params = req.body;
        console.log(params);
        var user_model = new UserModel(req.db);
        if (params.email && params.password) {
            bcrypt.genSalt(10, function (err, salt) {
                    if (err) res.send(500);
                    bcrypt.hash(params.password, salt, function (err, hash) {
                        if (err) res.send(500);
                        var user = {
                            email: params.email,
                            password: hash
                        }
                        user_model.insert(user, function (err, response) {
                            delete user.password;
                            res.json(user);
                        });

                    });
                }
            );
        }
        else {
            res.send(400, 'Bad request');
        }

    },
    update: function (req, res) {

    },
    destroy: function (req, res) {

    },
    current_user: function (req, res) {

    },
    login: function (req, res) {
        var params = req.body;
        if (params.email && params.password) {
            bcrypt.genSalt(10, function (err, salt) {
                    if (err) res.send(500);
                    bcrypt.hash(params.password, salt, function (err, hash) {
                        if (err) res.send(500);

                        user_model.insert(user, function (err, response) {
                            delete user.password;
                            res.json(user);
                        });

                    });
                }
            );
        } else {
            res.send(400, 'Bad request');
        }
    },
    logout: function (req, res) {

    }
};