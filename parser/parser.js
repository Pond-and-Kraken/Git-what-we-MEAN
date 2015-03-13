//Used to parse .json files
var fs = require('fs');

//folder with all the .json data scrapped from git
var dir= __dirname +'/../jsonData';
var data = {};


//loop through the data read in
var parseData = function(){
  var keys = Object.keys(data);
  var dependencies = [];
  var devdependencies = [];
  var gitName = '';

console.log(keys[0]);

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
  console.log('Git project:', gitName)
  console.log("Dependencies:", dependencies);
  console.log('Devdependencies:',devdependencies);
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
  fs.readdir(dir,function(err,files){
    if (err) throw err;

    //read in the data for each file
    files.forEach(function(file){
      fs.readFile(dir+ '/' + file, 'utf8', function(err,jsonData){
      if (err) throw err;
        data = {};
        //In case file contains Not Found, stringify before parsing to avoid an error
        data[file]=JSON.parse(JSON.stringify(jsonData));
        parseData();
            
      });
     
    });

  });

}


readFiles(parseData);
