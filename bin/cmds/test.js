var jake = require('jake')
  , path = require('path')

module.exports.call = function() {
  var jakefile, args, testNs

  testNs    = 'test:';
  args      = [].splice.call(arguments, 0);
  args      = args.map(function(arg){ return testNs + arg; });
  jakefile  = path.normalize(path.join(pineapple.PATH, 'Jakefile'));

  pineapple.logger.info('Executing Jakefile test => ' + jakefile);

  jake.program.parseArgs(args);
  jake.loader.loadFile(jakefile);

  jake.program.run();
};

module.exports.help = function(help) {
  return help("test", "<namespace> <suite> Execute test suites.");
};