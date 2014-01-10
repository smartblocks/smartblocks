var UserModel = require('../models/User');
var bcrypt = require('bcryptjs');
module.exports = {
    index: function (req, res) {
        UserModel.find(function (err, users) {
            if (err) res.send(500, 'Error');

            var response = [];

            for (var k in users) {
                var user = users[k].toObject();
                delete user.password;
                response.push(user);
            }
            res.json(response);
        });

    },
    show: function (req, res) {
        var id = req.params.id;

        if (id !== undefined) {
            UserModel.find({ _id: id }, function (err, users) {
                if (err) {
                    res.send(500, 'Error');
                } else {
                    if (users[0])
                        res.json(users[0]);
                    else
                        res.send(404, 'User not found');
                }
            });
        } else {
            res.send(500, 'error');
        }
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
                        var user = new UserModel({
                            email: params.email,
                            password: hash
                        });
                        user.save(function (err, user) {
                            if (err) {
                                res.send(500, 'Could not create user');
                            } else {
                                var response = user.toObject();
                                delete response.password;
                                res.json(response);
                            }
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
        if (req.session.user) {
            res.json(req.session.user);
        } else {
            res.send(400, 'not connected');
        }
    },
    login: function (req, res) {
        var params = req.body;
        if (params.email && params.password) {
            bcrypt.genSalt(10, function (err, salt) {
                    if (err) res.send(500);
                    bcrypt.hash(params.password, salt, function (err, hash) {
                        if (err) res.send(500);
                        UserModel.find({ email: params.email }, function (err, users) {
                            if (err) res.send(500);
                            console.log(users);
                            if (users[0] && users[0].password) {
                                var user = users[0].toObject();
                                delete user.password;
                                req.session.user = user;
                                res.send(200, 'Connected');
                            } else {
                                res.send(404, 'User not found');
                            }
                        });
                    });
                }
            );
        } else {
            res.send(400, 'Bad request');
        }
    },
    logout: function (req, res) {
        if (req.session.user) {
            req.session.user = undefined;
            res.send(200, 'disconnected');
        } else {
            res.send(400, 'not connected');
        }
    }
};