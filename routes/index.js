var express = require('express');
var wiki = require('./wiki');
var router = express.Router();

router.use('/wiki', wiki);

module.exports = router;
