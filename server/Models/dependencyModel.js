var mongoose = require('mongoose');
var Repo = require('./repoModel.js');

var DependencySchema = new mongoose.Schema({
  name: {
    type: String,
    //required: true,
    unique: true
  },
  // devDependency: {
  //   type: Boolean,
  //   required: true
  // },
  repos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Repo'
  }]
});

var Dependency = mongoose.model('Dependency', DependencySchema, 'Dependencies');


// var testDependency = new Dependency({
//   name: 'testName',
//   //devDependency: true,
//   repos: []
// });
// testDependency.save(function(err,t){
//   if (err) console.log("ERROR!");
//   console.log("id number ", t._id);
// });


module.exports = Dependency;