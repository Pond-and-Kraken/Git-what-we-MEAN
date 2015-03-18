var express = require('express');
var router = express.Router();
//var Dependencies = mongoose.model('Dependencies');

var Repos = require('../Models/repoModel.js');
var Dependencies = require('../Models/dependencyModel.js');

router.get('/dependencies', function(req, res, next) {
  console.log('Inside router.get');
  Dependencies.find(function(err,dependencies){
    if(err){
      console.error(err);
    }
    res.send(dependencies);
  });
});

module.exports = router;
