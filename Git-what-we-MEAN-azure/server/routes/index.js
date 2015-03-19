var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('index.js router.get');
  res.render('index');
});

module.exports = router;
