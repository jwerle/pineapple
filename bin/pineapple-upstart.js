var fs = require('fs')

module.exports.call = function() {
  var args, upstart, description, path, cmd

  args        = this.utils.makeArray(arguments);
  name        = args[0]
  description = args[1];
  path        = args[2];
  cmd         = args[3];

  if (! name) {
    pineapple.fatal("Upstart script needs a name.")
  }

  // Use default upstart script
  if (description && path && cmd) {
    upstart = fs.readFileSync(pineapple.PATH + '/scripts/upstart.conf').toString();
  }
  else if (pineapple.utils.stat(description)) { // Use one provided by first argument
    upstart = fs.readFileSync(description);
  }

  upstart = pineapple.utils.parseStringVariables(upstart, {
    upstart_description : description,
    upstart_path        : path,
    upstart_command     : cmd
  });

  try {
    fs.writeFileSync('/etc/init/' + name + '.conf', upstart);
  }
  catch (e) {
    pineapple.logger.error(e.message);
    pineapple.fatal("Failed to write upstart script");
  }
}

//module.exports.help