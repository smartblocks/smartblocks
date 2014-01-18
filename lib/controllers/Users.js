var UserModel = require('../models/User');
var bcrypt = require('bcryptjs');
module.exports = {
    index: function (req, res) {
        req.models.User.find({}, function (err, users) {
            if (err) res.send(500, 'error');
            var response = [];
            for (var k in users) {
                var user = users[k];
                user.password = undefined;
                response.push(user);
            }
            res.json(response);
        });

    },
    show: function (req, res) {
        var id = req.params.id;

        if (id !== undefined) {
            req.models.User.get(id, function (err, user) {
                if (err) {
                    res.send(500, 'error');
                } else {
                    user.password = undefined;
                    res.json(user);
                }
            });
        } else {
            res.send(500, 'error');
        }
    },
    create: function (req, res) {
        var params = req.body;
        var user_model = new UserModel(req.db);
        if (params.email && params.password) {
            bcrypt.genSalt(10, function (err, salt) {
                    if (err) res.send(500);
                    else
                        bcrypt.hash(params.password, salt, function (err, hash) {
                            if (err) res.send(500, 'error');
                            else {
                                console.log("AHAHAHA");
                                req.models.User.create([
                                    {
                                        email: params.email,
                                        password: hash,
                                        session_id: null
                                    }
                                ], function (err, users) {
                                    if (err) {
                                        res.send(500, 'error');
                                    } else {
                                        var user = users[0];
                                        user.password = undefined;
                                        res.json(user);
                                    }
                                });
                            }
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
                        req.models.User.find({ email: params.email }, function (err, users) {
                            if (err) res.send(500);
                            if (users[0] && users[0].password) {
                                var user = users[0];

                                req.session.user = user;
                                users[0].session_id = req.session.session_id;
                                users[0].save(function (err, user) {
                                    user.password = undefined;
                                    res.send(200, 'Connected');
                                });
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