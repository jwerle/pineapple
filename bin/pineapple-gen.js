var path  = require('path')
  , fs    = require('fs')
  , exec  = require('child_process').exec

module.exports.call = function() {
  var args = this.utils.makeArray(arguments)
    , name = args[0]
    , dir  = path.resolve(args[1]) + '/' + name
    , tpl  = path.resolve(__dirname, '../tpl')
  
  exec(['mkdir', dir].join(' '), function(error, stdout, stderr){
    if (error) {
      console.error(error)
    }
    else if (stderr) {
      console.error(stderr)
    }
    else {
      exec(['cp -rf', tpl + '/*', dir].join(' '), function(error, stdout, stderr){
        pineapple.logger.info("New Pineapple application created at ".cyan + dir.blue);
      });
    }
  })
};

module.exports.help = function(help) {
  return help('gen', "Generates a new pineapple api application.");
};