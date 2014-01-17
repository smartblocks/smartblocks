var config = {
    all: {
        site: {
            title: "MYSITE"
        },
        frontend: {
            startup_app: {
                block: 'main',
                app: 'home'
            }
        }
    },
    local: {
        mode: 'local',
        port: 3000,
        database: {
            dbdriver: 'mongoose',
            connection_str: 'mongodb://127.0.0.1:27017',
            name: 'bookstore_dev'
        }
    },
    staging: {
        mode: 'staging',
        port: 4000,
        database: {
            dbdriver: 'mongoose',
            connection_str: 'mongodb://127.0.0.1:27017',
            name: 'fastdelivery_staging'
        }
    },
    production: {
        mode: 'production',
        port: 5000,
        database: {
            dbdriver: 'mongoose',
            connection_str: 'mongodb://127.0.0.1:27017',
            name: 'fastdelivery'
        }
    },
    tests: {
        mode: 'tests',
        port: 5000,
        database: {
            dbdriver: 'mongoose',
            connection_str: 'mongodb://127.0.0.1:27017',
            name: 'fastdelivery_tests'
        }
    }
};

module.exports = function (mode) {
    var object = config[mode || process.argv[2] || 'local'] || config.local
    for (var k in config.all) {
        object[k] = config.all[k];
    }
    return object;
};