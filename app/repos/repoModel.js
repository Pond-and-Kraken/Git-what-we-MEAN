var mongoose = require('mongoose');

var RepoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  dependencies: [{
    type: Schema.Types.ObjectId,
    ref: 'Dependency'
  }]
});

var Repo = mongoose.model('Repo', RepoSchema, 'Repos');

module.exports = Repo;