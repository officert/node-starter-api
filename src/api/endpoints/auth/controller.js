const BaseController = require('../base');
const authService = require('modules/auth');

class AuthController extends BaseController {
  constructor() {
    super();
  }

  login(req, res, next) {
    let identityProvider = req.body.identityProvider;
    let accessToken = req.body.accessToken;

    authService.login({
        identityProvider,
        accessToken
      })
      .then(auth => res.status(200).json(auth))
      .catch(next);
  }
}

module.exports = new AuthController();
