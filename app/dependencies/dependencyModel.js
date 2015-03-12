var mongoose = require ('mongoose');

var DependencySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  devDependency: {
    type: Boolean,
    required: true
  },
  repos: [{
    type: Schema.Types.ObjectId,
    ref: 'Repo'
  }]
});

var Dependency = mongoose.model('Dependency', DependencySchema, 'Dependencies');

module.exports = Dependency;