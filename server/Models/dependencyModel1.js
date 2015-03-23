var mongoose = require('mongoose');
var Repo = require('./repoModel.js');

// create a mongoose schema for each of the library (or dependency) entries
var DependencySchema = new mongoose.Schema({
  //add a name property
  name: {
    type: String,
    //required: true,
    unique: true
  },
  // add a boolean for whether or not this is a dev dependency 
  devOrNot: {
    type: Boolean,
    required: true
  },
  // add an array of pointers to the Repo instances. These are strings with the repo name
  repos: [{
      type: mongoose.Schema.Types.String,
      ref: 'Repo'
    }]
});

// define the mongoose model 
var Dependency = mongoose.model('Dependency1', DependencySchema, 'Dependencies');

// Export the model
module.exports = Dependency;