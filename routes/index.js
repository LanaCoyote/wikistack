var express = require('express');
var wiki = require('./wiki');
var router = express.Router();

var Page = require('../models').Page;

router.use('/wiki', wiki);

router.get('/', function( req, res, next ) {
  res.redirect('/wiki/');
} );

router.get('/search', function( req, res, next ) {
  if ( req.query.search ) {
    var search_for = req.query.search.split(',').map( function( tag ){ return tag.trim() } );
  
    Page.findByTag( search_for )
    .then( function( pages ) {
      res.render( 'tagsearch', { search: req.query.search, pages: pages } );
    })
  } else {
    res.render( 'tagsearch' );
  }
} );

module.exports = router;
