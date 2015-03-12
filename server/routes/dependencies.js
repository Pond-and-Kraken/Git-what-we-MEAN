var express = require('express');
var router = express.Router();
var Dependencies = mongoose.model('Dependencies');

router.get('/dependencies', function(req, res, next) {
  Dependencies.find(function,err,dependencies){
    if(err){
      console.error(err);
    }
    res.json(dependencies);
  }
});

module.exports = router;
