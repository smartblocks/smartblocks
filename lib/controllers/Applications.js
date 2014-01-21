var SmartBlocks = require('../smartblocks');

module.exports = {
    index: function (req, res) {
        var blocks = SmartBlocks.getBlocks();
        var apps = [];
        for (var k in blocks) {
            var block = blocks[k];
            var block_apps = SmartBlocks.getApplications(block);
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
        }
        res.json(apps);
    }
};