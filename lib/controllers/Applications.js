var SmartBlocks = require('../smartblocks');

module.exports = {
    index: function (req, res) {
        SmartBlocks.getBlocksModels(function (blocks) {
            var apps = [];
            for (var k in blocks) {
                var block = blocks[k];
                SmartBlocks.getApplications(block, function (err, block_apps) {
                    for (var i in block_apps) {
                        var app = block_apps[i];
                        if (app.restricted_to) {
                            for (var k in app.restricted_to) {
                                if (req.session.rights && req.session.rights.indexOf(app.restricted_to[k]) !== -1) {
                                    apps.push(app);
                                }
                            }
                        } else {
                            apps.push(app);
                        }
                    }
                });

            }
            res.json(apps);
        });

    }
};