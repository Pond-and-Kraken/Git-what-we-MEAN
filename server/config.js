var mongoose = require('mongoose');

mongoURI = 'mongodb://localhost/meangit';

mongoose.connect('mongoURI');

var db = mongoose.connection;
db.on('error', consolerror.bind(console, 'connection error:'));
db.once('open', function(callback) {
  console.log('MONGODB CONNECTION OPEN');
});

module.exports = db;