var exec = require('child_process').exec

module.exports.call = function(){
  process.chdir(PINEAPPLE_PATH);

  pineapple.logger.info("Updating... (This may take a while)");
  exec('./scripts/update', function(error, stdout, stderr){
    var i, e = false

    if (stderr && !~ stderr.indexOf('npm')) {
      pineapple.logger.error("Something went wrong!");
      stderr = stderr.split("\n");

      for (i = 0; i < stderr.length; i++) {
        if (! stderr[i].trim().length) {
          continue;
        }

        pineapple.logger.error(stderr[i]);
      }
      
      e = true;
    }

    stdout = stdout.split("\n");

    for (i = 0; i < stdout.length; i++) {
      if (! stdout[i].trim().length) {
        continue;
      }

      if (!!~ stdout[i].indexOf('ERR')) {
        pineapple.logger.error(stdout[i]);
      }
      else {
        if (!!~ stdout[i].toLowerCase().trim().indexOf('need sudo')) {
          pineapple.logger.error(stdout[i]);
          pineapple.die();
        }
        else {
          pineapple.logger.info(stdout[i]);
        }
      }
    }

    if (e) {
      pineapple.logger.fail("Update failed!");
    }
    else {
      pineapple.logger.success("Update successful!");
    }

    pineapple.die();
  });
};

module.exports.help = function(help){
  return help("update", "Updates all the necessary dependents for Pineapple. (May require sudo)");
};