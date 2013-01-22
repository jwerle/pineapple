var fs = require('fs')
  , path = require('path')

module.exports.needs  = 'server';
module.exports.call   = function() {
  var args, upstart, upstart_description, upstart_path, upstart_command, upstart_destination, upstart_name

  args = this.utils.makeArray(arguments);
  upstart_name          = args[0]
  upstart_description   = args[1];
  upstart_path          = args[2];
  upstart_command       = args[3];
  upstart_destination   = path.normalize(args[4] || '/etc/init');
  upstart_destination   = upstart_destination + '/' + upstart_name + '.conf';

  pineapple.logger.info("upstart destination at " + upstart_destination);

  if (! upstart_name) {
    pineapple.fatal("Upstart script needs a name.")
  }

  // Use default upstart script
  if (upstart_description && upstart_path && upstart_command) {
    upstart = fs.readFileSync(pineapple.PATH + '/scripts/upstart.conf').toString();
  }
  else if (pineapple.utils.stat(upstart_description)) { // Use one provided by first argument
    upstart = fs.readFileSync(upstart_description);
  }

  upstart = pineapple.utils.parseStringVariables(upstart, {
    upstart_name        : upstart_name,
    upstart_description : upstart_description,
    upstart_path        : path.normalize(upstart_path),
    upstart_command     : upstart_command
  });

  try {
    fs.writeFileSync(upstart_destination, upstart);
  }
  catch (e) {
    pineapple.logger.error(e.message);
    pineapple.fatal("Failed to write upstart script");
  }
}

module.exports.help = function(help) {
  return help("upstart", "pineapple upstart <name> <description> <path> <command>");
}