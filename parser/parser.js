//Used to parse .json files
var fs = require('fs');

//folder with all the .json data scraped from git
var dir= __dirname +'/../jsonData';
var data = {};
var object = [];
var Repos = require('../server/Models/repoModel');
var Dependencies = require('../server/Models/dependencyModel');


// var insertDB = function(){
//   console.log(JSON.stringify(object));
// }

//loop through the data read in
var parseData = function(callback){
  var keys = Object.keys(data);
  var dependencies = [];
  var devdependencies = [];
  var gitName = '';

  // console.log(keys[0]);

  //remove bower.json.txt or package.json.txt from file name to get git name
  var temp = keys[0].split('.');
  gitName = temp.slice(0, temp.length-3).join('.');

 
  //If no .json data was found
  if(JSON.stringify(data[keys[0]]).indexOf('Not Found') >= 0) {
    dependencies.push('Not Found');
    devdependencies.push('Not Found');
  } else {
    //else check for dependencies and if they are there read them in
    data = JSON.parse(data[keys[0]]);
    if(data['dependencies'] === undefined){
      dependencies.push('Not Found');
    } else {
      for(var dep in data['dependencies']){
        dependencies.push(dep);
      }
    }
    if(data['devDependencies'] === undefined){
      devdependencies.push('Not Found');
    } else {
      for(var devdep in data['devDependencies']){
          devdependencies.push(devdep);
      }
    }
  }
  // console.log('Git project:', gitName)
  // console.log("Dependencies:", dependencies.concat(devdependencies));
  //console.log('Devdependencies:',devdependencies);
  //object[gitName] = dependencies.concat(devdependencies);
  //insertDB(object);
  //console.log(JSON.stringify(object));
  var deps = dependencies.concat(devdependencies);
  var repoID;
  var dependencyID;
  callback(deps);
  // Repos.findOne({name: gitName}, function(error, repo){
  //   if (error) console.log('error: ', error);
  //   if (!repo) {
  //     var newRepo = new Repo({
  //       name: gitName,
  //       dependencies: []
  //     });
  //     newRepo.save(function(error, newRepo){
  //       if (error) return console.error('Creating new Repo:',error);
  //       repoID = newRepo._id;
  //     });
  //   }
  //   //else
  // });
  //console.log(data);
  
  
}

//Inserting data into the database:
  //for each file, create a new repo instance
    // for each dependency in the file:
      // if the dependency is not in the database, create a new dependency instance
      // else
        // find the dependency
      // add the repo to the dependencies repo array
      // save the dependency
      // add the dependency to the repo dependencies array
  // save the repo 

//read in the files
var readFiles = function(parseData) {

  //var files = fs.readdirSync(dir);
  fs.readdir(dir,function(err,files){
    //if (err) throw err;

    //read in the data for each file
    files.forEach(function(file){

      //////////////////////
      data = {};
      data[file] = JSON.parse(JSON.stringify(fs.readFileSync(dir+ '/' + file, 'utf8')));
      parseData(function(deps) {
        for(var i = 0; i < deps.length;){
          if(deps[i] == 'Not Found'){
            deps.splice(i, 1);
            break;
          }
          // var currentDep = deps[i];
         
          var findStore = function(cntr){
            var currentDep = deps[cntr];
            console.log('Before: ', cntr);
            Dependencies.findOne({name: currentDep}).exec(function(error, found){
              console.log('current: ', currentDep);
              console.log('findOne: ', cntr);
              //console.log("FOUND ", found);
              if(error) console.log('error: ', error);
              if(found){
                console.log('!!!!!!!!!!! Already there !!!!!!!!!!!');
                console.log('found: ', cntr);
                i++;
                findStore(i)
              }else{
                console.log('create new');
                var newDependency = new Dependencies({
                  name: currentDep,
                  repos: []
                });

                newDependency.save(function(error, newDependency){
                  if(error) return console.error('creating new Dependency:', error);
                  dependencyID = newDependency._id;
                  console.log('save: ', cntr);
                  i++;
                  findStore(i);
                });
              }
            });
          };
        }
      });
      //////////////////////

    
      // fs.readFile(dir+ '/' + file, 'utf8', function(err,jsonData){
      // if (err) throw err;
      //   data = {};
      //   //In case file contains Not Found, stringify before parsing to avoid an error
      //   data[file]=JSON.parse(JSON.stringify(jsonData));
      //   parseData();   
      //   //console.log(object);
      // });

    });
  });


}

///////////////////////////

var mongoose = require('mongoose');
var mongoURI = 'mongodb://localhost/meangit';

mongoose.connect(mongoURI);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback) {
  console.log('MONGODB CONNECTION OPEN');
  readFiles(parseData);
  // var temp = {}
  // temp['ace.package.json.txt'] = JSON.parse(JSON.stringify(fs.readFileSync('/Users/jack829/greenfield/Git-what-we-MEAN/jsonData/ace.package.json.txt', 'utf8')));
  //parseData();
});

module.exports = db;

///////////////////////////




// exports.saveLink = function(req, res) {
//   var uri = req.body.url;

//   if (!util.isValidUrl(uri)) {
//     console.log('Not a valid url: ', uri);
//     return res.send(404);
//   }

//   Link.findOne({ url: uri}, function (err, link){
//     if (err) return  console.error('Signup database lookup:',err);
//     if (!link) {
//         }
//         var newLink = new Link({
//           url: uri,
//           title: title,
//           base_url: req.headers.origin
//         });
//         newLink.hashURL();
//         newLink.save(function(err, newLink) {
//           if (err) return console.error('Creating new link::',err);
//           res.send(200, newLink);
//         });
//       });
//     } else {
//       res.send(200, link);
//     }
//   });

// };
