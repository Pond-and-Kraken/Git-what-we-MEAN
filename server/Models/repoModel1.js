var mongoose = require('mongoose');
var Dependency = require('./dependencyModel.js');

// create a mongoose schema for each Repository entry
var RepoSchema = new mongoose.Schema({
  // add the repo name
  name: {
    type: String,
    //required: true,
    unique: true
  },
  //add arrays of pointers for dependencies and dev dependencies
  dependencies: [{
    type: mongoose.Schema.Types.String,
    ref: 'Dependency'
  }],
  devDependencies: [{
    type: mongoose.Schema.Types.String,
    ref: 'Dependency'
  }]
});

//define the repo mongoose model
var Repo = mongoose.model('Repo1', RepoSchema, 'Repos');

//export the model
module.exports = Repo;

