var models = require('../models');
var router = require('express').Router();

// models
var Page = models.Page;
var User = models.User;


router.get('/', function(req, res, next) {
  Page.find()
  .then( function ( pages ) {
    res.render('index', { pages: pages });
  } );
})

router.post('/', function(req, res, next) {
  // Find the author
  User.findOrCreate({
    name: req.body['author-name'],
    email: req.body['author-email']
  })
  // Create the page based on that user
  .then(function resolve(user) {
    console.dir( user );
    var page = new Page({
      title: req.body.title,
      content: req.body.content,
      author: user,
      status: req.body.status,
      tags: req.body.tags.split(',').map( function( tag ) { return tag.trim(); } )
    });
    return page.save();
  }, function error(err) {
    res.render( 'error', { message: "Username/E-mail combination incorrect", error: err } );
  })

  // Redirect us to the new page
  .then(function resolve(page) {
    res.redirect(page.route)
  }, function error( err ) {
    res.render( 'error', { message: "Could not save page", error: err } );
  });

});

router.get('/add', function(req, res, next) {
  res.render('addpage', {});
});

router.get('/:pageTitle', function(req, res, next) {
  Page.findOne({urlTitle: req.params.pageTitle})
  .populate('author').exec()
  .then(function resolve(page) {
    if (page !== null) {
      res.render('wikipage', { page: page });
    } else
      res.render('error', { message: "Page not found", error: { status:404 } });
  })
});

router.get('/:pageTitle/similar', function( req, res, next ) {
  Page.findOne({urlTitle: req.params.pageTitle})
  .then( function resolve( page ) {
    if ( page !== null ) {
      return page.findSimilar();
    } else {
      res.render('error', { message: "Page not found", error: { status:404 } });
      throw Error();
    }
  }).then( function resolve( pages ) {
    res.render( 'index', { pages:pages } );
  }, function error( err ) {

  });
});


module.exports = router;
