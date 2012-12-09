var exec = require('child_process').exec

module.exports.opts = [
  {abbr: 'm', full: 'm'}
];

module.exports.call = function(){
  var dir   = APP_PATH
    , args  = [].splice.call(arguments, 0)
    , cmds  = ['git']
    , child
    , i

  process.chdir(dir);

  for (i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '-m':
        args[i + 1] = ['"', args[i + 1], '"'].join('');
      break;

      default :
        continue;
      break;
    }
  }

  cmds.push(args.join(' '))
  child = exec (cmds.join(' '), function(error, stdout, stderr){
    if (error !== null) {
      console.error(error)
    }

    if (stderr) {
      console.error(stderr)
    }

    console.log(stdout.cyan)
  });

};

module.exports.help = function(help){
  return help('git', "<command> <args> Execute git commands on the pineapple repo");
};