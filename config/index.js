var config = {
    local: {
        mode: 'local',
        port: 3000,
        database: {
            connection_str: 'mongodb://127.0.0.1:27017',
            name: 'bookstore_dev'
        }
    },
    staging: {
        mode: 'staging',
        port: 4000,
        database: {
            connection_str: 'mongodb://127.0.0.1:27017',
            name: 'fastdelivery_staging'
        }
    },
    production: {
        mode: 'production',
        port: 5000,
        database: {
            connection_str: 'mongodb://127.0.0.1:27017',
            name: 'fastdelivery'
        }
    },
    tests: {
        mode: 'tests',
        port: 5000,
        database: {
            connection_str: 'mongodb://127.0.0.1:27017',
            name: 'fastdelivery_tests'
        }
    }
};

module.exports = function (mode) {
    return config[mode || process.argv[2] || 'local'] || config.local;
};