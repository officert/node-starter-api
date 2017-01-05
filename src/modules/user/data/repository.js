const BaseRepository = require('modules/base/data');
const UserModel = require('./model');

class UserRepository extends BaseRepository {
  constructor() {
    super(UserModel);
  }
}

module.exports = new UserRepository;
