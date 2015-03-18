var fs = require('fs');
var childProcess = require('child_process');
var CronJob = require('cron').CronJob;
var obj = {};

/* Set cronjob to run every 2.5 mins - 5 mins */
// try {
//   var job = new CronJob('*/5 * * * * *', function() {

//   count++;

//   if(count === limit){
//     job.stop();
//   }

//   });
// } catch(ex) {
//     console.log('cron pattern not valid');
// }

////Have a cronjob that runs once a day
//var job = new CronJob('00 00 0 * * *', function(){
// getRepos(); - get the top 100 most forked JS repos
//}, null, true);
//need to exports parsed data script and require
//need to seperate database actions? from parse have require to parse
//register app with git https://developer.github.com/guides/basics-of-authentication/
//Implementing “persistent” authentication



/* Get the top 100 most forked JS repos */
childProcess.exec('curl "https://api.github.com/search/repositories?page=1&per_page=100&q=+language:Javascript&sort=forks&order=desc" > top100ForkedJSRepos.txt', function(error, stdout, stderr){
    if(error != null){
      console.log('exec error: ', error);
    }
    else{
      console.log('Saved to top100ForkedJSRepos.txt\n');
      readObjects();
    }
});

/* Read output from file and parse and store in JSOn objext */
function readObjects(){
  obj = JSON.parse(fs.readFileSync('top100ForkedJSRepos.txt', 'utf8'));
  parseData();
}

/* Read in 100 js file and perform get request to package.json and bower.json contents */
function parseData(){
  for(var i = 0; i < 100; i++){
      childProcess.exec('curl "https://raw.githubusercontent.com/' + obj.items[i].full_name + '/master/package.json" > dependency-files/'+ obj.items[i].name + '.package.json.txt', function(error, stdout, stderr){
        if(error != null){
          console.log('exec error: ', error);
        }
        else{
          console.log('\nSaved contents file ');
        }
      });

      childProcess.exec('curl "https://raw.githubusercontent.com/' + obj.items[i].full_name + '/master/bower.json" > dependency-files/' + obj.items[i].name + '.bower.json.txt', function(error, stdout, stderr){
        if(error != null){
          console.log('exec error: ', error);
        }
        else{
          console.log('\nSaved contents file ');
        }
      });
  }
}
