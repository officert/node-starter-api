const authService = require('modules/auth');
const UnauthorizedError = require('errors/unauthorizedError');

const authErrorMessages = require('modules/auth/constants/errorMessages');
const headers = require('modules/auth/constants/headers');

function authenticate(req, res, next) {
  const token = req.headers[headers.AUTHENTICATION_HEADER];

  authService.isAuthenticated(token)
    .then(auth => {
      req.userId = auth.user;
      return next(null);
    })
    .catch(() => {
      return next(new UnauthorizedError(authErrorMessages.NOT_AUTHORIZED));
    });
}

function authenticateCurrentUser(id) {
  return function(req, res, next) {
    if (!id) next(new UnauthorizedError(authErrorMessages.NOT_AUTHORIZED));

    const token = req.headers[headers.AUTHENTICATION_HEADER];

    authService.isAuthenticated(token)
      .then(auth => {
        if (auth.user !== id) throw new UnauthorizedError(authErrorMessages.NOT_AUTHORIZED);

        req.userId = auth.user;

        return next(null);
      })
      .catch(() => {
        return next(new UnauthorizedError(authErrorMessages.NOT_AUTHORIZED));
      });
  };
}

module.exports = {
  authenticate,
  authenticateCurrentUser
};
