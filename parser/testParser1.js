var _ = require('underscore');
var fs = require('fs');
var nodeDir = require('node-dir');
var dir= __dirname +'/../jsonData';
// var repos = {};
// var deps = {};
var Repos = require('../server/Models/repoModel1');
var Dependencies = require('../server/Models/dependencyModel1');

var mongoose = require('mongoose');
var mongoURI = 'mongodb://localhost/meangit2';
mongoose.connect(mongoURI);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback) {
  console.log('MONGODB CONNECTION OPEN');

  nodeDir.readFiles(dir, {match: /\.package/},
      function(err, content, next) {
          if (err) throw err;
          //console.log("content ",content)
          if(!content.match(/Not\sFound/)){
            parseData(content, next);
          } else {
            next();
          }
      },
      function(err, files){
        if (err) throw err;
        nodeDir.readFiles(dir, {match: /\.bower/},
          function(err, content, next) {
            if (err) throw err;
            //console.log("content ",content)
            if(!content.match(/Not\sFound/)){
              parseData(content,next);
            } else {
              next();
            }
          },
          function(err, files){
            if (err) throw err;
            //console.log('finished reading files:', files);
          });
        //console.log('finished reading files:', files);
      });

});

var parseData = function(toParse,next){
  var parsed = JSON.parse(toParse);
  //console.log("to parse ",toParse)
  //var allDependencies = createDependencyTuple(parsed.dependencies,parsed.devDependencies);
  var repo = {
    'name': parsed.name,
    'dependencies': _.keys(parsed.dependencies),
    'devDependencies': _.keys(parsed.devDependencies)
  };
  updateRepo(repo,next);
};

// var createDependencyTuple = function(dependencies,devDependencies){
//   var depTuple = _.map(_.keys(dependencies),function(dep){
//     return [false,dep];
//   });
//   var devDepTuple = _.map(_.keys(devDependencies),function(dep){
//     return [true,dep];
//   });
//   return depTuple.concat(devDepTuple);
// }

var updateRepo = function(repo,next){
  //console.log("Deps: ",repo.name,repo.dependencies);
  //console.log("#ofDevDeps: ",repo.devDependencies.length);
  Repos.findOneAndUpdate(
      {name: repo.name},
      {
        $addToSet: {dependencies: {$each: repo.dependencies}, devDependencies: {$each: repo.devDependencies}}
      },
      {safe: true, upsert: true},
      function(err, model) {
          if(err) console.log(err);
          if(model.dependencies.length>1){
            //console.log("MODEL: ",model);
          }
          // Here we need to:
            // findandupdate the first dependency in teh repo model dependency array
            // then, from the callback in findandupdate, do the above step on the next dependency
            // repeat the above step until we get to the last dependency in the array
              // at this point call next()
          console.log("model.dependencies ",model.dependencies);
          recursiveAsyncIteration(0,
            model.dependencies,
            function(currentDepName,nextIteration){
              var dep = {
                name: currentDepName,
                devOrNot: false,
                // isBower: false,
                // isPackage: false
              };
              //console.log("1 ",dep.name);
              updateDependency(dep,model.name,nextIteration);
            },
            function(){
              recursiveAsyncIteration(0,
                model.devDependencies,
                function(currentDepName,nextIteration){
                  var dep = {
                    name: currentDepName,
                    devOrNot: true,
                    // isBower: isBower,
                    // isPackage: isPackage
                  };
                  //console.log("1 ",dep.name);
                  updateDependency(dep,model.name,nextIteration);
                },
                function(){
                  next();
              });            
            });
          //next();
      }
  );
};

var recursiveAsyncIteration = function(i,array,iterateCallback,finishedCallback){
  i = i || 0;
  //console.log("1 ",i,"2 ",array,"3 ",iterateCallback,"4 ",finishedCallback);
  if(i===array.length){
    finishedCallback();
  } else {
    //console.log("1 ",i,"2 ",array,"3 ",iterateCallback,"4 ",finishedCallback);
    var nextIteration = function(){
      recursiveAsyncIteration(i+1,array,iterateCallback,finishedCallback);
    };
    iterateCallback(array[i],nextIteration);
  }
}

var updateDependency = function(dependency,repoName,next){
  //console.log("2 ",dependency.name)
  Dependencies.findOneAndUpdate(
    {name: dependency.name},
    {
      $addToSet: {repos: repoName},
      devOrNot: dependency.devOrNot
    },
    {safe: true, upsert: true},
    function(err, model) {
        if(err) console.log(err);
        //console.log("MODEL: ",model);
        next();
    }
  );
}

// var updateRepo = function(repo,next){
//   Repos.findOneAndUpdate(
//       {name: repo.name},
//       {$push: {dependencies: repo.allDependencies}},
//       {safe: true, upsert: true},
//       function(err, model) {
//           if(err) console.log(err);
//           console.log("MODEL: ",model);
//           next();
//       }
//   );
// };

// var updateDependency = function(dependency,repoID,next){

// }


module.exports = db;
