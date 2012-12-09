const API_VERSION = parseInt(pineapple.config.server.config.version);

var router = new pineapple.router.Router()

// Prefix all routes with /v{VERSION} - uncomment line below to prefix all routes with an API version
// router.prefix('v' + API_VERSION);

router.useMethods(['GET', 'POST', 'PUT', 'DEL']);
router.setDefaultAction('index');

router.create('GET', '/', 'pineapple.Api.index');
router.get('/:resource', 'pineapple.Api'); // defaults to pineapple.Api.index

/**
  Exmaple user routes
    Default action for bound results is
    set by router.setDefaultAction(action)

// Catch all for '/user'
router.all('/user', 'user.User');
// OR
router.create('*', '/user', 'user.User');

// Get user by uuid with a GET request
router.get('/user/:uuid', 'user.User.get');
// OR
router.create('GET', '/user/:uuid', 'user.User.get');

// Basic CRUD methods which wrap router.create(method, path, bound);
router.post('/user', 'user.User.create');
router.get('/user/:uuid', 'user.User.get');
router.put('/user/:uuid', 'user.User.update');
router.del('/user/:uuid', 'user.User.delete');

**/

module.exports = router.routes;
