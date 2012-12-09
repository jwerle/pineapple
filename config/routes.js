const API_VERSION = parseInt(pineapple.config.server.config.version);

var router = new pineapple.router.Router()

// Prefix all routes with /v{VERSION}
router.prefix('v' + API_VERSION);

router.useMethods(['GET', 'POST', 'PUT', 'DEL']);
router.setDefaultAction('index');

/**
  @routes user
**/
router.all('/user', 'user.User');

/**
  Return user information by uid

  @route user/:uid
  @method GET
**/
router.get('/user/:uuid', 'user.User.get');


module.exports = router.routes;