
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var fs = require('fs');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'hjs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
app.use(express.static(path.join(__dirname, 'public')));

var blocks_folders = fs.readdirSync(path.join(__dirname, 'blocks'));

for (var k in blocks_folders) {
    var block_folder = blocks_folders[k];
    app.use('/' + block_folder, express.static(path.join(__dirname, 'blocks', block_folder, 'frontend')));
}

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/users', user.list);

var config = require('./config')();

var MongoClient = require('mongodb').MongoClient;

MongoClient.connect(config.database.connection_str + "/" + config.database.name, function (err, db) {

    if (err) {
        console.log("There is no MongoDB server running");
    } else {

        var attachDB = function (req, res, next) {
            req.db = db;
            next();
        };
        http.createServer(app).listen(config.port, function(){
            console.log('Express server listening on port ' + app.get('port'));
        });
    }
});

