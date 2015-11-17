var models = require('../models');
var router = require('express').Router();

// models
var Page = models.Page;
var User = models.User;


router.get('/', function(req, res, next) {
  res.render('addpage', {});
})

router.post('/', function(req, res, next) {
  User.findOne({
    name: req.body['author-name'],
    email: req.body['author-email']
  })
  .then(function resolve(user) {
    if (user !== null)
      return user;
    else {
      var newUser = new User({
        name: req.body['author-name'],
        email: req.body['author-email']
      });
      newUser.save();
      return newUser;
    }
  })
  .then(function resolve(user) {
    var page = new Page({
      title: req.body.title,
      content: req.body.content,
      author: user,
      status: req.body.status,
    });
    return page.save();
  })
  .then(function resolve(page) {
    res.redirect(page.route)
  });

})

router.get('/add', function(req, res, next) {
  res.render('addpage', {});
})

router.get('/:pageTitle', function(req, res, next) {
  Page.findOne({urlTitle: req.params.pageTitle})
  .populate('author').exec()
  .then(function resolve(page) {
    if (page !== null)
      res.render('wikipage', { page: page });
    else
      res.status(404).send('Page not found');
  })
})


module.exports = router;
