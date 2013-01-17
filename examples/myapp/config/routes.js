const API_VERSION = parseInt(pineapple.config.server.config.version);

var router = new pineapple.router.Router()

// Prefix all routes with /v{VERSION} - uncomment line below to prefix all routes with an API version
// router.prefix('v' + API_VERSION);

router.create('GET', '/', 'pineapple.Api.index');
router.get('/:resource', 'pineapple.Api.index');

// export the router which is bound to pineapple.app.router
module.exports = router;