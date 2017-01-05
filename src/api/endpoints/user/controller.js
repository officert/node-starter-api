const BaseController = require('../base');
const userService = require('modules/user');
const ObjectNotFoundError = require('errors/objectNotFoundError');

class UserController extends BaseController {
  constructor() {
    super();
  }

  me(req, res, next) {
    let userId = req.userId;

    userService.findById(userId)
      .then(user => {
        if (!user) return next(new ObjectNotFoundError('user not found'));

        return res.status(200).json(user);
      })
      .catch(next);
  }

  updateById(req, res, next) {
    let id = req.params.id;

    let updates = {};
    if ('firstName' in req.body) updates.firstName = req.body.firstName;
    if ('lastName' in req.body) updates.lastName = req.body.lastName;
    if ('profilePicture' in req.body) updates.profilePicture = req.body.profilePicture;

    userService.updateById(id, updates)
      .then(user => {
        res.status(200).json(user);
      })
      .catch(next);
  }
}

module.exports = new UserController();
