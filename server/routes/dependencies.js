var express = require('express');
var router = express.Router();

var Repos = require('../Models/repoModel1.js');
var Dependencies = require('../Models/dependencyModel1.js');

router.get('/dependencies', function(req, res, next) {
  //Find all dependency model objects from the database and send them back to the client
  Dependencies.find(function(err,dependencies){
    if(err){
      console.error(err);
    }
    res.send(dependencies);
  });
});

module.exports = router;
