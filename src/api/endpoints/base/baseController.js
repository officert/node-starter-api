const _ = require('lodash');

const InvalidArgumentError = require('errors/invalidArgumentError');

class BaseController {
  validate(validatorFn) {
    if (!validatorFn || !_.isFunction(validatorFn)) throw new InvalidArgumentError('validatorFn');

    return function(req, res, next) {
      validatorFn(req, res);

      req.getValidationResult()
        .then(result => {

          if (!result.isEmpty()) {
            return next({
              name: 'ControllerValidatorError',
              errors: convertValidationErrors(result.array())
            });
          }

          return next(null);
        });
    };
  }
}

function convertValidationErrors(errors) {
  return errors.map(err => err.msg);
}

module.exports = BaseController;
