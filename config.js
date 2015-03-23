var _ = require('underscore');
var fs = require('fs');
var nodeDir = require('node-dir');
var dir= __dirname +'/jsonData';

var Repos = require('./server/Models/repoModel1');
var Dependencies = require('./server/Models/dependencyModel1');

var mongoose = require('mongoose');
var mongoURI = process.env.MONGO || 'mongodb://localhost/meangit2';
mongoose.connect(mongoURI);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback) {
  console.log('MONGODB CONNECTION OPEN');

  //https://github.com/fshost/node-dir
  nodeDir.readFiles(                            //nodeDir.readFiles takes 4 arguments:
      dir,                                        // 1- the directory from which files will be read
      {match: /\.package/},                       // 2- options, in this case only read file's with names that match the regexp /\.package/
      function(err, content, next) {              // 3- a callback to be called for each file read
          if (err) throw err;                       // content is the contents of the read file, content type is string
          if(!content.match(/Not\sFound/)){         // content will be "Not Found" if the file is empty
            parseData(content, next);               // parseData is defined on line 49
          } else {                                  // next is a recursive call to the callback defined on line 22
            next();                                   // next ensures the callback gets called on the next file after the callback is finished execution on the current file
          }                                           // below, next is continuously passed as a callback until the end of the last function where readFile content data is used, at which point it is called (in this case, on line 107)
      },
      function(err, files){                       // 4- a callback to be called after all files have been read
        if (err) throw err;                         // In this case, nodeDir.readfiles is run again, this time reading the bower.json files
        nodeDir.readFiles(dir, {match: /\.bower/},
          function(err, content, next) {
            if (err) throw err;
            if(!content.match(/Not\sFound/)){
              parseData(content,next);
            } else {
              next();
            }
          },
          function(err, files){
            if (err) throw err;
            console.log('finished reading files:', files);
          });
      });

});

var parseData = function(toParse,next){
/*
Parse data creates a repo object from the contents of a read .package or .json file.
*/
  var parsed = JSON.parse(toParse);
  var repo = {
    'name': parsed.name,
    'dependencies': _.keys(parsed.dependencies),      // an array all dependency names from the .json file
    'devDependencies': _.keys(parsed.devDependencies) // an array all devDependency names from the .json file
  };
  updateRepo(repo,next);
};

var updateRepo = function(repo,next){
/*
updateRepo takes a repo object from parseData, and queries the database for a Repo
model instance with the same name. If it exists, it adds to the arrays of dependencies
and devdependency names. If it doesn't exist, it creates a new instance and inserts it
into the database. This is done via mongoose's findOneAndUpdate method.
*/
  //http://mongoosejs.com/docs/api.html#query_Query-findOneAndUpdate
  Repos.findOneAndUpdate(
      {name: repo.name},
      {
        //http://docs.mongodb.org/manual/reference/operator/update/addToSet/
        $addToSet: {dependencies: {$each: repo.dependencies}, devDependencies: {$each: repo.devDependencies}}
      },
      {safe: true, upsert: true},
      function(err, model) {
      /*
      This callback takes the just inserted/updated repo model instance, iterates over the array
      of dependency names in the model, creates and inserts (or just updates) a dependency
      model instance with that name, and then does the same for the array of devDependencies
      from the repo model instance.
      */
          if(err) console.log(err);

          recursiveAsyncIteration(  // this function takes 4 parametres
            0,                                        // 1- the starting index for the iteration
            model.dependencies,                       // 2- the array to iterate over
            function(currentDepName,nextIteration){   // 3- the function to call on each iteration
              var dep = {
                name: currentDepName,
                devOrNot: false,
              };
              updateDependency(dep,model.name,nextIteration); 
            },
            function(){                               // 4- the function to call after iteration is complete
              recursiveAsyncIteration(0,                // in this case, once we are done iterating over model.dependencies, we iterate over model.devdependencies
                model.devDependencies,
                function(currentDepName,nextIteration){
                  var dep = {
                    name: currentDepName,
                    devOrNot: true,
                  };
                  updateDependency(dep,model.name,nextIteration); 
                },
                function(){
                  next();                             // next, the callback first passed by nodeDir.readfiles on line 22, is finally called here
              });            
            });
      }
  );
};

var recursiveAsyncIteration = function(i,array,iterationCallback,finishedCallback){
  /*
    In the current case, array is always model.dependencies or model.deveDepencies,
    iterationCallback is a function that takes the dependency name at array[i], creates
    a dep object with that name, and passes it to updateDependency along with the repo model name
    and a recursive call to recursiveAsyncIteration on array[i+1] 
  */
  i = i || 0;
  if(i===array.length){   // If we have iterated over the entire array
    finishedCallback();     // Then call whatever should be called once we are done iterating
  } else {
    var nextIteration = function(){
      recursiveAsyncIteration(i+1,array,iterationCallback,finishedCallback);
    };
    // Call the iterationCallback function on the ith (i.e. current) array element, 
    // then recursively call it on (i+1)th (i.e. next) array element
    iterationCallback(array[i],nextIteration);
  }
}

var updateDependency = function(dependency,repoName,nextIteration){
/*
  dependency is just the dependency object created for each of the names in repo model
  instance dependency arrays. 
  repoName is model.name (see lines 77-109)
  nextIteration is the recursive call to ensure iteration continues onces work on the current array element is complete
*/
  Dependencies.findOneAndUpdate(
    {name: dependency.name},
    {
      $addToSet: {repos: repoName},
      devOrNot: dependency.devOrNot
    },
    {safe: true, upsert: true},
    function(err, model) {
        if(err) console.log(err);
        nextIteration();
    }
  );
}

module.exports = db;
