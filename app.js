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

// log request
app.use('/', function( req, res, next ) {
  res.on('finish', function() {
    console.log( chalk.green( req.method ), req.path, chalk.yellow( res.statusCode ) );
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
