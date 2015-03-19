var mongoose = require('mongoose');
var Dependency = require('./dependencyModel.js');

var RepoSchema = new mongoose.Schema({
  name: {
    type: String,
    //required: true,
    unique: true
  },
  dependencies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dependency'
  }]
});

var Repo = mongoose.model('Repo', RepoSchema, 'Repos');

module.exports = Repo;