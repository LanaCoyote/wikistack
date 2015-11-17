var models = require('../models');
var router = require('express').Router();

// models
var Page = models.Page;
var User = models.User;

router.get('/', function(req, res, next) {
  User.find().exec()
  .then(function resolve(users) {
    res.render('userlist', {users: users});
  });
});

router.get('/:userId', function(req, res, next) {
  var pArray = [];
  pArray.push( User.findById(req.params.userId).exec() );
  pArray.push( Page.find({author: req.params.userId}).exec() )

  Promise.all(pArray)
  .then(function resolve(vArray) {
    res.render('userpage', {
      user: vArray[0],
      pages: vArray[1]
    });
  })
});

module.exports = router;
