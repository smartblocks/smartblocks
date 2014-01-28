var config = {
    all: {
        site: {
            title: "SITE_NAME"
        },
        parts: {
            "": {
                blocks: 'all',
                access: [],
                layout: 'index',
                entry: {
                    block: 'main',
                    app: 'home',
                    url_params: []
                }
            }
        }
    },
    local: {
        mode: 'local',
        port: 3000,
        database: {
            connection_str: 'mongodb://127.0.0.1:27017',
            name: 'smartblocks_website_local'
        }
    },
    staging: {
        mode: 'staging',
        port: 4000,
        database: {
            connection_str: 'mongodb://127.0.0.1:27017',
            name: 'smartblocks_website_staging'
        }
    },
    production: {
        mode: 'production',
        port: 5000,
        database: {
            connection_str: 'mongodb://127.0.0.1:27017',
            name: 'smartblocks_website'
        }
    }
};

module.exports = function (mode) {
    var object = config[mode || process.argv[3] || 'local'] || config.local
    for (var k in config.all) {
        object[k] = config.all[k];
    }
    return object;
};