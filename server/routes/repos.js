var express = require('express');
var router = express.Router();
//var Dependencies = mongoose.model('Dependencies');

var Repos = require('../Models/repoModel1.js');
var Dependencies = require('../Models/dependencyModel1.js');

router.get('/repos', function(req, res, next) {
  console.log('Inside router.get');
  Repos.find(function(err,repos){
    if(err){
      console.error(err);
    }
    //console.log("Dependencies: ",dependencies);
    res.send(repos);
  });
});

module.exports = router;