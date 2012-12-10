var exec = require('child_process').exec

module.exports.call = function(){
  process.chdir(PINEAPPLE_PATH);
  exec('./scripts/install', function(error, stdout, stderr){
    if (error) {
      console.error(error)
    }

    if (stderr) {
      console.error(stderr)
    }

    console.log(stdout.cyan);
  });
};

module.exports.help = function(help){
  return help("install", "Installs all the necessary dependents for the Pineapple API Service.");
};