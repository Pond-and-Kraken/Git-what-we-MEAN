 var mongoose = require('mongoose');
var Dependency = require('./dependencyModel.js');

var RepoSchema = new mongoose.Schema({
  name: {
    type: String,
    //required: true,
    unique: true
  },
  dependencies: [],
  devDependencies: []
});

var Repo = mongoose.model('Repo1', RepoSchema, 'Repos');

module.exports = Repo;

// {
//       type: mongoose.Schema.Types.String,
//       ref: 'Dependency'
//     }

// {
//       type: mongoose.Schema.Types.String,
//       ref: 'Dependency'
//     }