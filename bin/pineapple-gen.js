var path      = require('path')
  , fs        = require('fs')
  , exec      = require('child_process').exec
  , faker     = require('Faker')

module.exports.call = function() {
  var args = this.utils.makeArray(arguments)
    , name = args[0]
    , tpl  = path.resolve(__dirname, '../tpl')
    , dir

  if (! name) {
    pineapple.logger.warn("Aw shucks, you didn't provide me with an app name, but hey, don't fret! I can generate one for you!");
    
    promptAppname();
  }
  else {
    makeApp(name);
  }
  
  function makeApp(name) {
    dir  = path.resolve(args[1]) + '/' + name

    exec(['mkdir', dir].join(' '), function(error, stdout, stderr){
      if (error) {
        console.error(error)
      }
      else if (stderr) {
        console.error(stderr)
      }
      else {
        exec(['cp -rf', tpl + '/*', dir].join(' '), function(error, stdout, stderr){
          pineapple.logger.info("Sweet! I've created a new Pineapple application here => ".cyan + dir.blue);
        });
      }
    })
  }

  function promptAppname() {
    name = faker.Internet.domainWord();

    pineapple.logger.question("How does ["+ name.cyan +"] sound? (y/n/exit)", function(answer){
      switch (answer.toLowerCase()) {
        case 'y':
          makeApp(name);
          pineapple.logger.cli.close();
        break;

        case 'n':
          pineapple.logger.warn("Okay, I understand. I won't create that app with that name.");
          pineapple.logger.cli.close();
        break;

        default : 
          pineapple.logger.warn("Oops! Looks like that is a response I just don't understand. Stupid pineapple!");
          promptAppname();
        break;
      }
    });
  }
};

module.exports.help = function(help) {
  return help('gen', "Generates a new pineapple api application.");
};