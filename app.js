var bodyparser = require('body-parser');
var chalk = require('chalk');
var express = require('express');
var router = require('./routes')
var swig = require('swig');

var app = express();

// app config
app.engine( 'html', swig.renderFile );
app.set( 'view engine', 'html' ); //
app.set( 'views', __dirname + '/views' );

swig.setDefaults( { cache: false } );
require('./filters')( swig );

// log request
app.use('/', function( req, res, next ) {
  var origpath = req.path;
  res.on('finish', function() {
    console.log( chalk.green( req.method ), origpath, chalk.yellow( res.statusCode ) );
  } );
  next();
} );

// body parsing middleware
app.use(bodyparser.urlencoded( { extended: false } ));
app.use(bodyparser.json());
app.use('/static', express.static( __dirname + '/public') );

app.use('/', router);

// start server
var server = app.listen( 3000, function() {
  console.log( "Listening on port 3000" );
} );
