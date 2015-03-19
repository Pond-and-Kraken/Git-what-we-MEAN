var fs = require('fs');
var dir= __dirname +'/../jsonData';
var repos = {};
var deps = {};
var Repos = require('../server/Models/repoModel');
var Dependencies = require('../server/Models/dependencyModel');


var readFiles = function() {
  var files = fs.readdirSync(dir);
    for(var j = 0; j < files.length; j++){
      var file = files[j];
      var data = {};
      data[file] = JSON.parse(JSON.stringify(fs.readFileSync(dir+ '/' + file, 'utf8')));
      var keys = Object.keys(data);
      var dependencies = [];
      var devdependencies = [];
      var temp = keys[0].split('.');
      var gitName = temp.slice(0, temp.length-3).join('.');
      if(JSON.stringify(data[keys[0]]).indexOf('Not Found') >= 0) {
        dependencies.push('Not Found');
        devdependencies.push('Not Found');
      }
      else
      {
        data = JSON.parse(data[keys[0]]);
        if(data['dependencies'] === undefined){
          dependencies.push('Not Found');
        }
        else
        {
          for(var dep in data['dependencies']){
            if(dependencies.indexOf(dep) === -1){
              dependencies.push(dep);
            }
            if(deps[dep] === undefined){
              deps[dep] = [];
            }
            if(deps[dep].indexOf(gitName) === -1){
              deps[dep].push(gitName);
            }
          }
        }
        if(data['devDependencies'] === undefined)
        {
          devdependencies.push('Not Found');
        }
        else
        {
          for (var devdep in data['devDependencies']) {
            if(dependencies.indexOf(devdep) === -1){
              dependencies.push(devdep);
            }
            if(deps[devdep] === undefined){
              deps[devdep] = [];
            }
            if(deps[devdep].indexOf(gitName) === -1){
              deps[devdep].push(gitName);
            }
          }
        }
      }
      repos[gitName] = dependencies.concat(devdependencies);
    };
};



var mongoose = require('mongoose');
var mongoURI = 'mongodb://localhost/meangit';

mongoose.connect(mongoURI);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback) {
  console.log('MONGODB CONNECTION OPEN');
  readFiles();
//console.log(repos['mean']);
  console.log(deps);
  //console.log(Dependencies.find());

  //Dependencies.find().exec(function(error, found){
  //
  //}
  //
  //for(var i in deps){
  //     Dependencies.findOne({name: i}).exec(function(error, found){
  //      if(error) console.log('error: ', error);
  //      if(found){
  //        console.log('!!!!!!!!!!! Already there !!!!!!!!!!!');
  //      }else{
  //        console.log('create new');
  //        var newDependency = new Dependencies({
  //          name: i,
  //          repos: deps[i]
  //        });
  //
  //        newDependency.save(function(error, newDependency){
  //          if(error) return console.error('creating new Dependency:', error);
  //          dependencyID = newDependency._id;
  //          //console.log('save: ', i);
  //        });
  //      }
  //    });
  //}
});

module.exports = db;

//readFiles();
