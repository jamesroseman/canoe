/* jshint node: true */
/**
 * Module dependencies.
 */

//  Configure express
var express = require('express'),
    routes = require('./lib/routes'),
    api  = require('./lib/routes/api'),
    http = require('http'),
    path = require('path'),
    socketServer = require('./lib/socketServer');

//  Configure DUST
var dust = require('consolidate').dust;

var app = express();

// Configure environments
app.engine('dust' , dust);
app.set('port', process.env.PORT || 80);
app.set('views', __dirname + '/views');
app.set('view engine', 'dust');
app.use(express.favicon('public/img/favicon.ico'));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, '/public')));

app.get('/', routes.index);
app.get('/api/:location', api.yelp);

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

socketServer.socketServer(server);