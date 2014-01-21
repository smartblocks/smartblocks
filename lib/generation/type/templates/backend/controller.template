module.exports = {
    index: function (req, res) {
        req.models.{{ model_name }}.find({}, function (err, {{ model_name_lower }}s) {
            if (err) {
                res.send(500, 'error');
            } else {
                res.json({{ model_name_lower }}s);
            }
        });
    },
    show: function (req, res) {
        var id = req.params.id;
        req.models.{{ model_name }}.get(id, function (err, {{ model_name_lower }}) {
            if (err) {
                res.send(404, 'not found');
            } else {
                res.json({{ model_name_lower }});
            }
        });
    },
    create: function (req, res) {
        req.models.{{ model_name }}.create([
            req.body
        ], function (err, {{ model_name_lower }}s) {
            res.json({{ model_name_lower }}s[0]);
        });
    },
    update: function (req, res) {
        var id = req.params.id;
        req.models.{{ model_name }}.get(id, function (err, {{ model_name_lower }}) {
            if (err) {
                res.send(404);
            } else {
                for (var k in req.body) {
                    {{ model_name_lower }}[k] = req.body[k];
                }

                {{ model_name_lower }}.save(function (err) {
                    if (err) {
                        res.send(500);
                    } else {
                        res.json({{ model_name_lower }});
                    }
                });
            }
        });
    },
    destroy: function (req, res) {
        var id = req.params.id;
        req.models.{{ model_name }}.get(id, function (err, {{ model_name_lower }}) {
            if (err) {
                res.send(404);
            } else {
                {{ model_name_lower }}.remove(function (err) {
                    if (err) {
                        res.send(500);
                    } else {
                        res.send(200, 'success');
                    }
                });
            }
        });
    }
};