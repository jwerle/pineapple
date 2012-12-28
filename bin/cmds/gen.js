var path      = require('path')
  , fs        = require('fs')
  , exec      = require('child_process').exec
  , faker     = require('Faker')

module.exports.call = function() {
  var args = this.utils.makeArray(arguments)
    , name = args[0]
    , tpl  = path.resolve(pineapple.PATH, 'tpl')
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
    
    try {
      pineapple.logger.cli.close();
    }
    catch (e){}

    pineapple.logger.question("How does ["+ name.cyan +"] sound? (y/n/exit)", function(answer){
      switch (answer.toLowerCase()) {
        case 'y':
          makeApp(name);
          pineapple.logger.cli.close();
        break;

        case 'n':
          pineapple.logger.info("Okay, I understand. Let's try again. You can respond with exit if you want me to stop.");
          promptAppname();
        break;

        case 'exit' :
          pineapple.logger.info("Okay, okay. I get it. Maybe you should provide your own then.");
          pineapple.logger.warn("I'm exiting..");
          pineapple.die();
        break;

        default : 
          pineapple.logger.warn("Oops! Looks like that is a response I just don't understand.");
          promptAppname();
        break;
      }
    });
  }
};

module.exports.help = function(help) {
  return help('gen', "Generates a new pineapple api application.");
};